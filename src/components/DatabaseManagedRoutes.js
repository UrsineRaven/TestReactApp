import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { getLocalIsoDateAndTime } from '../helpers/TimeHelpers';
import useInterval from '../hooks/useInterval';
import useLocalStorage from '../hooks/useLocalStorage';
import History from '../pages/History';
import Home from '../pages/Home';
import Settings from '../pages/Settings';
import Types from '../pages/Types';
import RulesEngineAlerts from './RulesEngineAlerts';

//#region Test Data        TODO: Remove
const testDataEventTypes = [
  { name: '#1', id: '1', lastModified: 1568223239995 },
  { name: 'test', id: '2', lastModified: 1568223239996 },
  { name: 'meal', id: '3', lastModified: 1568223239997 },
  {
    name: 'Example',
    id: '4',
    formatting:
      '{"className":"table-warning", "style":{"fontStyle": "italic"}}',
    lastModified: 1568223239998
  },
  { name: 'hidden-example', id: '5', hidden: true, lastModified: 1568223239999 }
];

const testDataEntries = [
  { datetime: 1568223240000, event: '1', id: '123' },
  { datetime: 1568237400000, event: '2', id: '235' },
  { datetime: 1568240640000, event: '3', id: '332' },
  { datetime: 1568229546000, event: '4', id: '331' },
  { datetime: 1568309640000, event: '4', id: '400' },
  { datetime: 1568323800000, event: '3', id: '404' },
  { datetime: 1568327040000, event: '2', id: '408' },
  { datetime: 1568315946000, event: '1', id: '402' }
];
//#endregion

function DatabaseManagedRoutes() {
  //#region State Variables
  const [evtTypes, setEvtTypes] = useState(testDataEventTypes);
  const [evts, setEvts] = useState(testDataEntries);
  const [lastSync, setLastSync] = useState();
  const [notConnected, setNotConnected] = useState(false);
  const [localChanges, setLocalChanges] = useLocalStorage(
    'local-changes',
    null
  );
  //#endregion

  //#region App Settings Variables
  const [pollInterval, setPollInterval] = useLocalStorage('poll-interval', 0);
  const [showHiddenTypes, setShowHiddenTypes] = useLocalStorage(
    'show-hidden-types',
    false
  );
  const [showTimeSince, setShowTimeSince] = useLocalStorage(
    'show-time-since',
    false
  );
  const [allowOfflineChanges, setAllowOfflineChanges] = useLocalStorage(
    'allow-offline-changes',
    false
  );
  const [offlineOnly, setOfflineOnly] = useLocalStorage('offline-only', false);
  //#endregion

  // TODO: add more robust/helpful (logging) error handling
  // TODO: maybe move localChanges stuff to new component/hook; This component is getting complex

  //#region instance variables (reset every render)
  const syncInterval = pollInterval || 5; // if allow offline changes is true, try to reconnect to the server this often
  let exitingOfflineOnly = false;
  let eventTypeChangeQueue;
  let eventChangeQueue;
  //#endregion

  //#region Effects
  // Fetch data for initial load
  useEffect(() => {
    if (!lastSync) {
      syncData();
    }
  });
  //#endregion

  //#region Intervals
  // Refresh data based on poll interval
  useInterval(
    () => {
      syncData();
    },
    !offlineOnly && pollInterval > 0 ? pollInterval * 60000 : null
  );

  // Try to sync local changes when not connected
  useInterval(
    () => {
      syncData();
    },
    !offlineOnly && notConnected && allowOfflineChanges && localChanges !== null
      ? syncInterval * 60000
      : null
  );
  //#endregion

  //#region Handlers
  async function handleEditType(evtType) {
    let succeeds = true;
    // TODO: uncomment
    // const index = evtTypes.findIndex(e => e.id === evtType.id);
    // let newType = index === -1;
    // if (newType) {
    //   try {
    //     const url = '/event-types';
    //     const options = {
    //       method: 'POST',
    //       body: JSON.stringify(evtType),
    //       headers: {
    //         'Content-Type': 'application/json'
    //       }
    //     }
    //     const typeResponse = await fetch(url, options);
    //     if (!typeResponse.ok) succeeds = false;
    //   } catch {
    //     succeeds = false;
    //   }
    // } else {
    //   try {
    //     const url = `/event-types/${evtType.id}`;
    //     const options = {
    //       method: 'PUT',
    //       body: JSON.stringify(evtType),
    //       headers: {
    //         'Content-Type': 'application/json'
    //       }
    //     }
    //     const typeResponse = await fetch(url, options);
    //     if (!typeResponse.ok) succeeds = false;
    //   } catch {
    //     succeeds = false;
    //   }
    // }

    if (succeeds && !offlineOnly) {
      updateEventTypesLocally([evtType]);
    } else {
      setNotConnected(true);
      if (localChangesAllowed()) trackEventTypesLocally(evtType);
    }
  }

  async function handleNewEvent(id, timeStr) {
    let succeeds = true;
    const newEvt = generateNewEvent(id, timeStr);
    // TODO: uncomment
    // try {
    //   const url = '/events';
    //   const options = {
    //     method: 'POST',
    //     body: JSON.stringify(newEvt),
    //     headers: {
    //       'Content-Type': 'application/json'
    //     }
    //   };
    //   const typeResponse = await fetch(url, options);
    //   if (!typeResponse.ok) succeeds = false;
    // } catch {
    //   succeeds = false;
    // }

    if (succeeds && !offlineOnly) {
      addNewEventsLocally([newEvt]);
    } else {
      setNotConnected(true);
      if (localChangesAllowed()) trackNewEventLocally(newEvt);
    }
  }

  async function handleDeleteEvent(id) {
    let succeeds = true;
    // TODO: uncomment
    // try {
    //   const url = `/events/${id}`;
    //   const options = {
    //     method: 'DELETE'
    //   };
    //   const typeResponse = await fetch(url, options);
    //   if (!typeResponse.ok) succeeds = false;
    // } catch {
    //   succeeds = false;
    // }

    if (succeeds && !offlineOnly) {
      deleteEventsLocally([id]);
    } else {
      setNotConnected(true);
      if (localChangesAllowed()) trackDeletedEventLocally(id);
    }
  }

  function handleSetOfflineOnly(newVal) {
    if (!newVal) {
      exitingOfflineOnly = true;
      syncData();
    }
    setOfflineOnly(newVal);
  }
  //#endregion

  //#region Helpers
  function generateNewEvent(
    id,
    timeStr = null,
    dateTime,
    otherReservedEventIds = []
  ) {
    // get the highest existing event id.   TODO: check if there's a more efficient way
    // TODO: maybe extract localChanges logic to a separate function
    let ids;
    if (exitingOfflineOnly) {
      ids = eventChangeQueue.map(e => e.id).concat(otherReservedEventIds);
    } else {
      const newEvtIds =
        localChanges && localChanges.newEvents
          ? localChanges.newEvents.map(e => e.id)
          : [];
      ids = evts.map(e => e.id).concat(newEvtIds);
    }
    let max = -1;
    for (let i of ids) if (i > max) max = i; // eslint-disable-line no-unused-vars

    const newId = String(Number(max) + 1);
    if (!dateTime) {
      const [date, time] = getLocalIsoDateAndTime(new Date());
      if (timeStr) {
        dateTime = new Date(date + 'T' + timeStr).getTime();
      } else {
        dateTime = new Date(date + 'T' + time).getTime();
      }
    }

    return {
      datetime: dateTime,
      event: id,
      id: newId
    };
  }

  function localChangesAllowed() {
    return !exitingOfflineOnly && (offlineOnly || allowOfflineChanges);
  }

  function trackEventTypesLocally(evtType) {
    let newLocalChanges = Object.assign({}, localChanges || {});
    if (!newLocalChanges.eventTypes) newLocalChanges.eventTypes = [];

    // Remove event type with same ID in local changes
    const idx = newLocalChanges.eventTypes.findIndex(e => e.id === evtType.id);
    if (idx !== -1) newLocalChanges.eventTypes.splice(idx, 1);

    // Add new/modified event type to local changes
    newLocalChanges.eventTypes.push(evtType);
    setLocalChanges(newLocalChanges);
  }

  function updateEventTypesLocally(updatedEventTypeArray, isBulkChange) {
    let eventTypes = evtTypes.slice();
    // eslint-disable-next-line no-unused-vars
    for (let eType of updatedEventTypeArray) {
      const index = eventTypes.findIndex(t => t.id === eType.id);
      if (index >= 0) {
        eventTypes.splice(index, 1, eType);
      } else {
        eventTypes.push(eType);
      }
    }
    if (!isBulkChange) {
      setEvtTypes(eventTypes);
    } else {
      eventTypeChangeQueue = eventTypes;
    }
  }

  function trackNewEventLocally(newEvt) {
    let newLocalChanges = Object.assign({}, localChanges || {});
    if (!newLocalChanges.newEvents) newLocalChanges.newEvents = [];
    newLocalChanges.newEvents.push(newEvt);
    setLocalChanges(newLocalChanges);
  }

  function addNewEventsLocally(newEventsArray, isBulkChange) {
    if (!isBulkChange) {
      setEvts(evts.concat(newEventsArray));
    } else {
      eventChangeQueue = eventChangeQueue.concat(newEventsArray);
    }
  }

  function trackDeletedEventLocally(id) {
    let newLocalChanges = Object.assign({}, localChanges || {});

    // make sure the id doesn't correspond to an id in the newEvents changes
    let index = -2;
    if (newLocalChanges && newLocalChanges.newEvents) {
      index = newLocalChanges.newEvents.findIndex(evt => evt.id === id);
    }

    if (index >= 0) {
      // event is in localChanges as new event, so we remove it
      newLocalChanges.newEvents.splice(index, 1);
    } else {
      if (!newLocalChanges.deleteEvents) newLocalChanges.deleteEvents = [];
      newLocalChanges.deleteEvents.push(id);
    }
    setLocalChanges(newLocalChanges);
  }

  function deleteEventsLocally(deleteEventsArray, isBulkChange) {
    const resultRows = evts.slice();
    // eslint-disable-next-line no-unused-vars
    for (let id of deleteEventsArray) {
      const index = resultRows.findIndex(r => r.id === id);
      resultRows.splice(index, 1);
    }
    if (!isBulkChange) {
      setEvts(resultRows);
    } else {
      eventChangeQueue = resultRows;
    }
  }

  function bulkUpdateEventTypes(updatedEventTypeArray) {
    let successes = [];
    const array = updatedEventTypeArray.slice();
    // eslint-disable-next-line no-unused-vars
    for (let evtType of array) {
      // TODO: maybe update event types in bulk and respond with failures
      const origId = evtType.id;
      const index = evtTypes.findIndex(e => e.id === evtType.id);
      const newType = index === -1;
      // Handle id conflicts
      const i = eventTypeChangeQueue.find(t => t.id === evtType.id);
      if (i) {
        if (newType) {
          // get the highest existing event id.   TODO: check if there's a more efficient way
          const ids = eventTypeChangeQueue
            .map(t => t.id)
            .concat(updatedEventTypeArray.map(t => t.id));
          let max = -1;
          for (let i of ids) if (i > max) max = i; // eslint-disable-line no-unused-vars

          evtType.id = String(Number(max) + 1);
        } else if (i.lastModified > evtType.lastModified) {
          const index = updatedEventTypeArray.indexOf(evtType);
          updatedEventTypeArray.splice(index, 1);
          continue;
        }
      }

      if (newType) {
        // TODO: push event type to database (Put)
      } else {
        // TODO: update event type in database (Post)
      }
      let success = true; // TODO: actually set success state based off database request response
      if (success) {
        const idx = updatedEventTypeArray.findIndex(t => t.id === origId);
        successes.push(updatedEventTypeArray.splice(idx, 1)[0]);
      }
    }
    updateEventTypesLocally(successes, true);
  }

  function bulkAddEvents(newEventsArray) {
    let successes = [];
    const array = newEventsArray.slice();
    // eslint-disable-next-line no-unused-vars
    for (let evt of array) {
      // TODO: maybe add events in bulk and respond with failures
      // TODO: Try to push to database
      // if succeeds:
      const index = newEventsArray.indexOf(evt);
      successes.push(newEventsArray.splice(index, 1)[0]);
    }
    addNewEventsLocally(successes, true);
  }

  function bulkDeleteEvents(deleteEventsArray) {
    let successes = [];
    const array = deleteEventsArray.slice();
    // eslint-disable-next-line no-unused-vars
    for (let id of array) {
      // skip delete if eventType has been updated since last sync
      const i = eventChangeQueue.findIndex(
        e => e.id === id && e.lastModified > lastSync
      );
      if (i !== -1) {
        const index = deleteEventsArray.indexOf(id);
        deleteEventsArray.splice(index, 1);
        continue;
      }
      // TODO: maybe delete events in bulk and respond with failures
      // TODO: Try to delete from database
      // if succeeds:
      const index = deleteEventsArray.indexOf(id);
      successes.push(deleteEventsArray.splice(index, 1)[0]);
    }
    deleteEventsLocally(successes, true);
  }

  function tryPushLocalChanges() {
    const newLocalChanges = Object.assign({}, localChanges);
    let error = false;
    let eventTypeChanges = [];
    let eventsToDelete = [];
    let newEventsToPush = [];

    // handle new/modified event types
    if (!error && localChanges.eventTypes) {
      eventTypeChanges = localChanges.eventTypes.slice();
      bulkUpdateEventTypes(eventTypeChanges);
      newLocalChanges.eventTypes = eventTypeChanges;
    }
    if (eventTypeChanges.length > 0) error = true;

    // handle deletes
    if (!error && localChanges.deleteEvents) {
      eventsToDelete = localChanges.deleteEvents.slice();
      bulkDeleteEvents(eventsToDelete);
      newLocalChanges.deleteEvents = eventsToDelete;
    }
    if (eventsToDelete.length > 0) error = true;

    // handle new events
    if (!error && localChanges.newEvents) {
      // eslint-disable-next-line no-unused-vars
      for (let evt of localChanges.newEvents) {
        newEventsToPush.push(
          generateNewEvent(
            evt.event,
            null,
            evt.datetime,
            newEventsToPush.map(e => e.id)
          )
        );
      }
      bulkAddEvents(newEventsToPush);
      newLocalChanges.newEvents = newEventsToPush;
    }
    if (newEventsToPush.length > 0) error = true;

    // Handle error condition
    if (!error) {
      setLocalChanges(null);
    } else {
      setLocalChanges(newLocalChanges);
    }
    return error;
  }
  //#endregion

  async function syncData() {
    let error = false;
    eventTypeChangeQueue = evtTypes.slice();
    eventChangeQueue = evts.slice();

    // TODO: uncomment
    try {
      // let responseTypes, responseEvts;
      // const typeResponse = await fetch('/event-types');
      // if (typeResponse.ok) responseTypes = await typeResponse.json();
      // else throw new Error('non-success response');
      // const evtResponse = await fetch('/events');
      // if (evtResponse.ok) responseEvts = await evtResponse.json();
      // else throw new Error('non-success response');
      // eventTypeChangeQueue = responseTypes;
      // eventChangeQueue = responseEvts;
      setLastSync(new Date().getTime());
    } catch {
      error = true;
    }

    if (!error && localChanges !== null) {
      error = tryPushLocalChanges();
    }
    setNotConnected(error); // TODO: Show alert
    setEvtTypes(eventTypeChangeQueue);
    setEvts(eventChangeQueue);
    alert('pretend the data was refreshed :)');
  }

  let events = evts.slice();
  let eventTypes = evtTypes.slice();
  // Apply local changes to data from server
  if (localChanges) {
    if (localChanges.newEvents) {
      events = events.concat(localChanges.newEvents);
    }
    if (localChanges.deleteEvents) {
      // eslint-disable-next-line no-unused-vars
      for (let id of localChanges.deleteEvents) {
        const index = events.findIndex(evt => evt.id === id);
        if (index >= 0) events.splice(index, 1);
      }
    }
    if (localChanges.eventTypes) {
      // eslint-disable-next-line no-unused-vars
      for (let eType of localChanges.eventTypes) {
        const index = eventTypes.findIndex(t => t.id === eType.id);
        if (index >= 0) {
          eventTypes.splice(index, 1, eType);
        } else {
          eventTypes.push(eType);
        }
      }
    }
  }

  return [
    <RulesEngineAlerts key="rules-engine-alerts" />, // TODO: Notifications page/dropdown w/ badge
    <Route
      path="/"
      exact
      render={() => (
        <Home
          evtTypes={eventTypes}
          rows={events}
          onNewEvent={handleNewEvent}
          onDeleteEvent={handleDeleteEvent}
          offlineOnly={offlineOnly}
          onRefresh={syncData}
        />
      )}
      key="home"
    />,
    <Route
      path="/history/"
      render={() => (
        <History
          evtTypes={eventTypes}
          rows={events}
          showTimeSince={showTimeSince}
        />
      )}
      key="history"
    />,
    <Route
      path="/type-management/"
      render={() => (
        <Types
          evtTypes={eventTypes}
          onEditType={handleEditType}
          showHidden={showHiddenTypes}
        />
      )}
      key="type-management"
    />,
    <Route
      path="/settings/"
      render={() => (
        <Settings
          pollInterval={pollInterval}
          onChangePollInterval={newVal => setPollInterval(newVal)}
          showHiddenTypes={showHiddenTypes}
          onChangeShowHiddenTypes={newVal => setShowHiddenTypes(newVal)}
          showTimeSince={showTimeSince}
          onChangeShowTimeSince={newVal => setShowTimeSince(newVal)}
          allowOfflineChanges={allowOfflineChanges}
          onChangeAllowOfflineChanges={newVal => setAllowOfflineChanges(newVal)}
          offlineOnly={offlineOnly}
          onChangeOfflineOnly={newVal => handleSetOfflineOnly(newVal)}
        />
      )}
      key="settings"
    />
  ];
}

export default DatabaseManagedRoutes;

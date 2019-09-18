import React, { useState } from 'react';
import { Route } from 'react-router-dom';
import useInterval from '../hooks/useInterval';
import useLocalStorage from '../hooks/useLocalStorage';
import History from '../pages/History';
import Home from '../pages/Home';
import Settings from '../pages/Settings';
import Types from '../pages/Types';
import { getLocalIsoDateAndTime } from './Helpers';

// Test Data        TODO: Remove
const testDataEventTypes = [
  { name: '#1', id: '1' },
  { name: 'test', id: '2' },
  { name: 'meal', id: '3' },
  {
    name: 'Example',
    id: '4',
    formatting: '{"className":"table-warning", "style":{"fontStyle": "italic"}}'
  },
  { name: 'hidden-example', id: '5', hidden: true }
];

const testDataEntries = [
  { date: '2019-09-11', time: '12:34', event: '1', id: '123' },
  { date: '2019-09-11', time: '16:30', event: '2', id: '235' },
  { date: '2019-09-11', time: '17:24', event: '3', id: '332' },
  { date: '2019-09-11', time: '14:19:06', event: '4', id: '331' },
  { date: '2019-09-12', time: '12:34', event: '4', id: '400' },
  { date: '2019-09-12', time: '16:30', event: '3', id: '404' },
  { date: '2019-09-12', time: '17:24', event: '2', id: '408' },
  { date: '2019-09-12', time: '14:19:06', event: '1', id: '402' }
];

function DatabaseManagedRoutes() {
  //#region State Variables
  const [evtTypes, setEvtTypes] = useState(testDataEventTypes);
  const [evts, setEvts] = useState(testDataEntries);
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
  const [allowOfflineLogging, setAllowOfflineLogging] = useLocalStorage(
    'allow-offline-logging',
    false
  );
  const [offlineOnly, setOfflineOnly] = useLocalStorage('offline-only', false);
  //#endregion

  // TODO: maybe move localChanges stuff to new component/hook; This component is getting complex

  //#region instance variables (reset every render)
  const syncInterval = pollInterval || 5; // if allow offline logging is true, try to reconnect to the server this often
  let exitOfflineOnly = false;
  let eventChangeQueue;
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
    !offlineOnly && notConnected && allowOfflineLogging && localChanges !== null
      ? syncInterval * 60000
      : null
  );
  //#endregion

  //#region Handlers
  function handleEditType(evt) {
    const index = evtTypes.findIndex(e => e.id === evt.id);
    if (index === -1) {
      setEvtTypes(evtTypes.concat([evt]));
      // TODO: push event type to database
    } else {
      let cp = evtTypes.slice();
      cp.splice(index, 1, evt);
      setEvtTypes(cp);
      // TODO: update event type in database
    }
  }

  function handleNewEvent(id, timeStr) {
    const newEvt = generateNewEvent(id, timeStr);

    const succeeds = true; // TODO: push event to database
    if (succeeds && !offlineOnly) {
      addNewEventsLocally([newEvt]);
    } else {
      setNotConnected(true);
      if (!exitOfflineOnly && (offlineOnly || allowOfflineLogging)) {
        let newLocalChanges = Object.assign({}, localChanges || {});
        if (!newLocalChanges.newEvents) newLocalChanges.newEvents = [];
        newLocalChanges.newEvents.push(newEvt);
        setLocalChanges(newLocalChanges);
      }
    }
  }

  function handleDeleteEvent(id) {
    const succeeds = true; // TODO: delete event from database
    if (succeeds && !offlineOnly) {
      deleteEventsLocally([id]);
    } else {
      setNotConnected(true);
      if (!exitOfflineOnly && (offlineOnly || allowOfflineLogging)) {
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
    }
  }

  function handleSetOfflineOnly(newVal) {
    if (!newVal) {
      exitOfflineOnly = true;
      syncData();
    }
    setOfflineOnly(newVal);
  }
  //#endregion

  //#region Helpers
  function generateNewEvent(id, timeStr, dateStr, otherReservedEventIds = []) {
    // get the highest existing event id.   TODO: check if there's a more efficient way
    const newEvtIds = exitOfflineOnly
      ? otherReservedEventIds.map(e => e.id)
      : localChanges && localChanges.newEvents
      ? localChanges.newEvents.map(e => e.id)
      : [];
    const ids = evts.map(e => e.id).concat(newEvtIds);
    let max = -1;
    for (let i of ids) if (i > max) max = i; // eslint-disable-line no-unused-vars

    const newId = String(Number(max) + 1);
    const [date, time] = getLocalIsoDateAndTime(new Date());
    return {
      date: dateStr || date,
      time: timeStr || time,
      event: id,
      id: newId
    };
  }

  function addNewEventsLocally(newEventsArray, isBulkChange) {
    if (!isBulkChange) {
      setEvts(evts.concat(newEventsArray));
    } else {
      eventChangeQueue = eventChangeQueue.concat(newEventsArray);
    }
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

  function bulkAddEvents(newEventsArray) {
    let successes = [];
    const array = newEventsArray.slice();
    // eslint-disable-next-line no-unused-vars
    for (let evt of array) {
      // TODO: maybe add events in bulk and respond with failures
      // TODO: Try to push to database
      // if succeeds:
      let index = newEventsArray.indexOf(evt);
      successes.push(newEventsArray.splice(index, 1)[0]);
    }
    addNewEventsLocally(successes, true);
  }

  function bulkDeleteEvents(deleteEventsArray) {
    let successes = [];
    const array = deleteEventsArray.slice();
    // eslint-disable-next-line no-unused-vars
    for (let id of array) {
      // TODO: maybe delete events in bulk and respond with failures
      // TODO: Try to delete from database
      // if succeeds:
      let index = deleteEventsArray.indexOf(id);
      successes.push(deleteEventsArray.splice(index, 1)[0]);
    }
    deleteEventsLocally(successes, true);
  }
  //#endregion

  function syncData() {
    let error = false;
    eventChangeQueue = evts.slice();
    // TODO: pull changes from server (set notConnected accordingly)
    //if (!error) eventChangeQueue = results; // TODO: actually use database results
    if (!error && localChanges !== null) {
      const newLocalChanges = Object.assign({}, localChanges);
      let eventsToDelete = [];
      let newEventsToPush = [];

      // handle deletes    TODO: come up with way to ensure that a new event on the server doesn't have the id (e.g. someone deletes last event then adds new event)
      if (!error && localChanges.deleteEvents) {
        eventsToDelete = localChanges.deleteEvents.slice();
      }
      bulkDeleteEvents(eventsToDelete);
      newLocalChanges.deleteEvents = eventsToDelete;
      if (eventsToDelete.length > 0) error = true;

      // handle new events
      if (!error && localChanges.newEvents) {
        // eslint-disable-next-line no-unused-vars
        for (let evt of localChanges.newEvents) {
          newEventsToPush.push(
            generateNewEvent(evt.event, evt.time, evt.date, newEventsToPush)
          );
        }
      }
      bulkAddEvents(newEventsToPush);
      newLocalChanges.newEvents = newEventsToPush;
      if (newEventsToPush.length > 0) error = true;

      // Handle error condition
      if (!error) {
        setLocalChanges(null);
      } else {
        setLocalChanges(newLocalChanges);
      }
      // TODO: support updating event types when offline (will need to change names and descriptions on settings page)
    }
    setNotConnected(error);
    setEvts(eventChangeQueue);
    alert('pretend the data was refreshed :)');
  }

  // Apply local changes to data from server
  let events = evts.slice();
  if (localChanges && localChanges.newEvents && localChanges.newEvents.length)
    events = events.concat(localChanges.newEvents);
  if (
    localChanges &&
    localChanges.deleteEvents &&
    localChanges.deleteEvents.length
  ) {
    // eslint-disable-next-line no-unused-vars
    for (let id of localChanges.deleteEvents) {
      let index = events.findIndex(evt => evt.id === id);
      if (index >= 0) events.splice(index, 1);
    }
  }

  return [
    <Route
      path="/"
      exact
      render={() => (
        <Home
          evtTypes={evtTypes}
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
      render={() => <History evtTypes={evtTypes} rows={events} />}
      key="history"
    />,
    <Route
      path="/type-management/"
      render={() => (
        <Types
          evtTypes={evtTypes}
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
          allowOfflineLogging={allowOfflineLogging}
          onChangeAllowOfflineLogging={newVal => setAllowOfflineLogging(newVal)}
          offlineOnly={offlineOnly}
          onChangeOfflineOnly={newVal => handleSetOfflineOnly(newVal)}
        />
      )}
      key="settings"
    />
  ];
}

export default DatabaseManagedRoutes;

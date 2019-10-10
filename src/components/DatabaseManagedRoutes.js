import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { getLocalIsoDateAndTime } from '../helpers/TimeHelpers';
import useDatabase from '../hooks/useDatabase';
import useInterval from '../hooks/useInterval';
import useLocalChanges from '../hooks/useLocalChanges';
import useSettings from '../hooks/useSettings';
import History from '../pages/History';
import Home from '../pages/Home';
import Settings from '../pages/Settings';
import Types from '../pages/Types';
import RulesEngineAlerts from './RulesEngineAlerts';

function DatabaseManagedRoutes() {
  const database = useDatabase();
  const localChanges = useLocalChanges();
  const settings = useSettings();

  // instance variables (reset every render)
  const syncInterval = settings.pollInterval || 5; // if allow offline changes is true, try to reconnect to the server this often
  let exitingOfflineOnly = false;
  let eventTypeChangeQueue;
  let eventChangeQueue;

  // Fetch data for initial load
  useEffect(() => {
    if (!database.lastSync) {
      syncData();
    }
  });

  // TODO: add more robust/helpful (logging) error handling

  //#region Intervals
  // Refresh data based on poll interval
  useInterval(
    () => {
      syncData();
    },
    !settings.offlineOnly && settings.pollInterval > 0
      ? settings.pollInterval * 60000
      : null
  );

  // Try to sync local changes when not connected
  useInterval(
    () => {
      syncData();
    },
    !settings.offlineOnly &&
      database.notConnected &&
      settings.allowOfflineChanges &&
      localChanges.changes !== null
      ? syncInterval * 60000
      : null
  );
  //#endregion

  //#region Handlers
  async function handleEditType(evtType) {
    let succeeds = true;
    // TODO: uncomment
    //succeeds = database.tryModifyType(evtType);

    if (succeeds && !settings.offlineOnly) {
      database.updateEventTypesInRAM([evtType]);
    } else {
      database.setNotConnected(true);
      if (localChangesAllowed()) localChanges.trackEventType(evtType);
    }
  }

  async function handleNewEvent(id, timeStr) {
    let succeeds = true;
    const newEvt = generateNewEvent(id, timeStr);
    // TODO: uncomment
    //succeeds = await database.tryCreateEvent(newEvt);

    if (succeeds && !settings.offlineOnly) {
      database.addNewEventsToRAM([newEvt]);
    } else {
      database.setNotConnected(true);
      if (localChangesAllowed()) localChanges.trackNewEvent(newEvt);
    }
  }

  async function handleDeleteEvent(id) {
    let succeeds = true;
    // TODO: uncomment
    //succeeds = await database.tryDeleteEvent(id);

    if (succeeds && !settings.offlineOnly) {
      database.deleteEventsFromRAM([id]);
    } else {
      database.setNotConnected(true);
      if (localChangesAllowed()) localChanges.trackDeletedEvent(id);
    }
  }

  function handleSetOfflineOnly(newVal) {
    if (!newVal) {
      exitingOfflineOnly = true;
      syncData();
    }
    settings.setOfflineOnly(newVal);
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
        localChanges.changes && localChanges.changes.newEvents
          ? localChanges.changes.newEvents.map(e => e.id)
          : [];
      ids = database.events.map(e => e.id).concat(newEvtIds);
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
    return (
      !exitingOfflineOnly &&
      (settings.offlineOnly || settings.allowOfflineChanges)
    );
  }

  function tryPushLocalChanges() {
    const newLocalChanges = Object.assign({}, localChanges.changes);
    let error = false;
    let eventTypeChanges = [];
    let eventsToDelete = [];
    let newEventsToPush = [];

    // handle new/modified event types
    if (!error && localChanges.changes.eventTypes) {
      eventTypeChanges = localChanges.changes.eventTypes.slice();
      const successes = database.bulkUpdateEventTypes(
        eventTypeChanges,
        eventTypeChangeQueue
      );
      eventTypeChangeQueue = database.updateEventTypesInRAM(
        successes,
        eventTypeChangeQueue
      );
      newLocalChanges.eventTypes = eventTypeChanges;
    }
    if (eventTypeChanges.length > 0) error = true;

    // handle deletes
    if (!error && localChanges.changes.deleteEvents) {
      eventsToDelete = localChanges.changes.deleteEvents.slice();
      const successes = database.bulkDeleteEvents(
        eventsToDelete,
        eventChangeQueue
      );
      eventChangeQueue = database.deleteEventsFromRAM(successes, true);
      newLocalChanges.deleteEvents = eventsToDelete;
    }
    if (eventsToDelete.length > 0) error = true;

    // handle new events
    if (!error && localChanges.changes.newEvents) {
      // eslint-disable-next-line no-unused-vars
      for (let evt of localChanges.changes.newEvents) {
        newEventsToPush.push(
          generateNewEvent(
            evt.event,
            null,
            evt.datetime,
            newEventsToPush.map(e => e.id)
          )
        );
      }
      const successes = database.bulkAddEvents(newEventsToPush);
      eventChangeQueue = database.addNewEventsToRAM(
        successes,
        eventChangeQueue
      );
      newLocalChanges.newEvents = newEventsToPush;
    }
    if (newEventsToPush.length > 0) error = true;

    // Handle error condition
    if (!error) {
      localChanges.setChanges(null);
    } else {
      localChanges.setChanges(newLocalChanges);
    }
    return error;
  }
  //#endregion

  async function syncData() {
    let error = false,
      success;
    eventTypeChangeQueue = database.eventTypes.slice();
    eventChangeQueue = database.events.slice();

    [
      success,
      eventTypeChangeQueue,
      eventChangeQueue
    ] = await database.tryPullChanges(eventTypeChangeQueue, eventChangeQueue);
    if (!success) error = true;

    if (
      !error &&
      localChanges.changes !== null &&
      (!settings.offlineOnly || exitingOfflineOnly)
    ) {
      error = tryPushLocalChanges();
    }
    database.setNotConnected(error); // TODO: Show alert
    database.setEventTypes(eventTypeChangeQueue);
    database.setEvents(eventChangeQueue);
    alert('pretend the data was refreshed :)');
  }

  const [events, eventTypes] = localChanges.apply(
    database.events.slice(),
    database.eventTypes.slice()
  );

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
          offlineOnly={settings.offlineOnly}
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
          timeSinceFormat={settings.timeSinceFormat}
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
          showHidden={settings.showHiddenTypes}
        />
      )}
      key="type-management"
    />,
    <Route
      path="/settings/"
      render={() => (
        <Settings
          pollInterval={settings.pollInterval}
          onChangePollInterval={newVal => settings.setPollInterval(newVal)}
          showHiddenTypes={settings.showHiddenTypes}
          onChangeShowHiddenTypes={newVal =>
            settings.setShowHiddenTypes(newVal)
          }
          timeSinceFormat={settings.timeSinceFormat}
          onChangeTimeSinceFormat={newVal =>
            settings.setTimeSinceFormat(newVal)
          }
          allowOfflineChanges={settings.allowOfflineChanges}
          onChangeAllowOfflineChanges={newVal =>
            settings.setAllowOfflineChanges(newVal)
          }
          offlineOnly={settings.offlineOnly}
          onChangeOfflineOnly={newVal => handleSetOfflineOnly(newVal)}
        />
      )}
      key="settings"
    />
  ];
}

export default DatabaseManagedRoutes;

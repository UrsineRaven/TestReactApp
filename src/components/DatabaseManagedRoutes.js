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
  const [evtTypes, setEvtTypes] = useState(testDataEventTypes);
  const [evts, setEvts] = useState(testDataEntries);
  const [notConnected, setNotConnected] = useState(false);

  // App Settings
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

  // TODO: maybe move localChanges stuff to new component/hook

  // if allow offline logging is true, try to reconnect to the server this often
  const syncInterval = pollInterval || 5;
  // TODO: add ability to store changes and sync when next able to

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
    !offlineOnly && notConnected && allowOfflineLogging
      ? syncInterval * 60000
      : null
  );

  function syncData() {
    let error = false;
    // TODO: Sync data with the database here
    // TODO: pull changes from server (set notConnected accordingly)
    // TODO: loop through local changes
    // TODO: push events
    // TODO: delete events
    // TODO: support updating event types when offline (will need to change names and descriptions on settings page)
    setNotConnected(error);
    alert('pretend the data was refreshed :)');
  }

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

  function generateNewEvent(id, timeStr, dateStr) {
    // get the highest existing event id.   TODO: check if there's a more efficient way
    const newEvtIds = [];
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

  function handleNewEvent(id, timeStr) {
    const newEvt = generateNewEvent(id, timeStr);

    setEvts(evts.concat([newEvt]));
    // TODO: push event to database
  }

  function handleDeleteEvent(id) {
    const resultRows = events.slice();
    const index = resultRows.findIndex(r => r.id === id);
    resultRows.splice(index, 1);
    setEvts(resultRows);
    // TODO: delete event from database
  }

  // Apply local changes to data from server
  let events = evts.slice();

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
          onChangeOfflineOnly={newVal => setOfflineOnly(newVal)}
        />
      )}
      key="settings"
    />
  ];
}

export default DatabaseManagedRoutes;

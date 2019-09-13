import React, { useState } from 'react';
import { Route } from 'react-router-dom';
import useInterval from '../hooks/useInterval';
import useLocalStorage from '../hooks/useLocalStorage';
import History from '../pages/History';
import Home from '../pages/Home';
import Settings from '../pages/Settings';
import Types from '../pages/Types';
import { getLocalIsoDateAndTime } from './Helpers';

// Test Data
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
  const [events, setEvents] = useState(testDataEntries);
  const [pollInterval, setPollInterval] = useLocalStorage('poll-interval', 0);

  useInterval(
    () => {
      refreshData();
    },
    pollInterval > 0 ? pollInterval * 60000 : null
  );

  function refreshData() {
    // TODO: Refresh data from the database here
    alert('pretend the data was refreshed :)');
  }

  function handleEditType(evt) {
    const index = evtTypes.findIndex(e => e.id === evt.id);
    if (index === -1) {
      setEvtTypes(evtTypes.concat([evt]));
    } else {
      let cp = evtTypes.slice();
      cp.splice(index, 1, evt);
      setEvtTypes(cp);
    }
  }

  function handleNewEvent(id, timeStr) {
    const newId = Math.max(...events.map(e => e.id)) + 1;
    const [date, time] = getLocalIsoDateAndTime(new Date());

    setEvents(
      events.concat([
        { date: date, time: timeStr || time, event: id, id: newId }
      ])
    );
  }

  function handleDeleteEvent(id) {
    let resultRows = events.slice();
    for (var i = 0; i < resultRows.length; i++) {
      if (resultRows[i].id === id) {
        resultRows.splice(i, 1);
      }
    }
    setEvents(resultRows);
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
          onRefresh={refreshData}
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
      render={() => <Types evtTypes={evtTypes} onEditType={handleEditType} />}
      key="type-management"
    />,
    <Route
      path="/settings/"
      render={() => (
        <Settings
          pollInterval={pollInterval}
          onChangePollInterval={newVal => setPollInterval(newVal)}
        />
      )}
      key="settings"
    />
  ];
}

export default DatabaseManagedRoutes;

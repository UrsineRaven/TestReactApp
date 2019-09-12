import React from 'react';
import { useState } from 'react';
import { Route } from 'react-router-dom';

import { getLocalIsoDateAndTime } from './Helpers';

// Pages
import History from '../pages/History';
import Home from '../pages/Home';
import Types from '../pages/Types';

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
        />
      )}
    />,
    <Route
      path="/type-management/"
      render={() => <Types evtTypes={evtTypes} onEditType={handleEditType} />}
    />,
    <Route
      path="/history/"
      render={() => <History evtTypes={evtTypes} rows={events} />}
    />
  ];
}

export default DatabaseManagedRoutes;

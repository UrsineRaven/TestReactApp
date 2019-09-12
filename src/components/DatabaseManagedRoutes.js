import React from 'react';
import { useState } from 'react';
import { Route } from 'react-router-dom';

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
  { time: '12:34', event: '1', id: '123' },
  { time: '16:30', event: '2', id: '235' },
  { time: '17:24', event: '3', id: '332' },
  { time: '2:19:06 PM', event: '4', id: '333' }
];

function DatabaseManagedPages() {
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

  function handleNewEvent(id) {
    const newId = Math.max(...events.map(e => e.id)) + 1;

    setEvents(
      events.concat([
        { time: new Date().toLocaleTimeString(), event: id, id: newId }
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

export default DatabaseManagedPages;

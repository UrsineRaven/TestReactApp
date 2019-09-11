import React from 'react';
import { useState, useEffect } from 'react';
import './Home.css';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const testDataEventTypes = [
  { name: '#1', id: '1' },
  { name: 'test', id: '2' },
  { name: 'meal', id: '3' }
];

const testDataEntries = [
  { time: '12:34', event: '#1', id: '123' },
  { time: '16:30', event: 'test', id: '235' },
  { time: '17:24', event: 'meal', id: '332' }
];

function NewEventCard(props) {
  const eventButtons = props.eventTypes.map(evt => {
    return (
      <Button
        variant="secondary"
        title={'New ' + evt.name}
        key={evt.id}
        onClick={() => props.evtClick(evt.id)}
        style={{ width: '100%' }}
        className="col-lg-2 col-md-3 col-sm-4 col-6"
      >
        {evt.name}
      </Button>
    );
  });
  return (
    <Card border="primary">
      <Card.Header>New Events:</Card.Header>
      <Card.Body>
        <Form>
          <Form.Group as={Row} controlId="inputTime">
            <Form.Label column xs="auto">
              Time (if not now):
            </Form.Label>
            <Col>
              <Form.Control type="time" name="Time" />
            </Col>
          </Form.Group>
          <Row>{eventButtons}</Row>
        </Form>
      </Card.Body>
    </Card>
  );
}

function TableRow(props) {
  return (
    <tr>
      <td className="small-col">{props.time}</td>
      <td className="big-col">{props.event}</td>
      <td className="btn-col">
        <button className="text-danger symbol" onClick={props.onDelete}>
          <span>&times;</span>
        </button>
      </td>
    </tr>
  );
}

function Home() {
  const [rows, setRows] = useState(testDataEntries);
  const [evtTypes] = useState(testDataEventTypes);
  const [updateTime, setUpdateTime] = useState(new Date().toLocaleString());

  useEffect(() => {
    setUpdateTime(new Date().toLocaleString());
  }, [rows, evtTypes]);

  function handleEventClick(id) {
    const newId = Math.max(...rows.map(e => e.id)) + 1;
    let eventName;
    for (let i = 0; i < evtTypes.length; i++) {
      if (evtTypes[i].id === id) {
        eventName = evtTypes[i].name;
        break;
      }
    }

    setRows(
      rows.concat([
        { time: new Date().toLocaleTimeString(), event: eventName, id: newId }
      ])
    );
  }

  function handleDelete(id) {
    let resultRows = rows.slice();
    for (var i = 0; i < resultRows.length; i++) {
      if (resultRows[i].id === id) {
        resultRows.splice(i, 1);
      }
    }
    setRows(resultRows);
  }

  const tableRows = rows.map(row => {
    return (
      <TableRow
        time={row.time}
        event={row.event}
        onDelete={() => handleDelete(row.id)}
        key={row.id}
      />
    );
  });

  return (
    <div>
      <h5 class="mt-3">
        {'Page last updated: '}
        <small className="text-muted">{updateTime}</small>
      </h5>
      <NewEventCard
        eventTypes={testDataEventTypes}
        evtClick={handleEventClick}
      />
      <Table striped bordered size="sm" className="mt-2">
        <thead>
          <tr>
            <th className="small-col">Time</th>
            <th className="big-col">Event</th>
            <th className="symbol">&times;</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </Table>
    </div>
  );
}

export default Home;

import React from 'react';
import { useState } from 'react';
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
      <Col lg={2} md={3} sm={4} xs={6}>
        <Button
          type="submit"
          variant="secondary"
          title={'New ' + evt.name}
          key={evt.id}
          onClick={() => props.evtClick(props.id)}
          style={{ width: '100%' }}
        >
          {evt.name}
        </Button>
      </Col>
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
      <td>{props.time}</td>
      <td>{props.event}</td>
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

  function handleEventClick(id) {
    setRows(
      rows.concat([{ time: Date.now().toLocaleString(), event: id, id: 99 }])
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
      <h2>Home</h2>
      <NewEventCard
        eventTypes={testDataEventTypes}
        evtClick={handleEventClick}
      />
      <Table striped bordered size="sm">
        <thead>
          <tr>
            <th className="col-auto">Time</th>
            <th className="col">Event</th>
            <th className="symbol col-1">&times;</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </Table>
    </div>
  );
}

export default Home;

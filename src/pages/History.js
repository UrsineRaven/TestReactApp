import React from 'react';
import { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

function History(props) {
  const eventTypes = {};
  props.evtTypes.forEach(type => {
    eventTypes[type.id] = {
      name: type.name,
      formatting: type.formatting
    };
  });

  const tableRows = props.rows
    .filter(row => {
      return true; // need to apply filters here
    })
    .sort((row1, row2) =>
      (row2.date + row2.time).localeCompare(row1.date + row1.time)
    ) // sort descending by date and time
    .map(row => {
      return (
        <TableRow
          date={row.date}
          time={row.time}
          event={eventTypes[row.event].name}
          formatting={eventTypes[row.event].formatting}
          key={row.id}
        />
      );
    });

  return (
    <>
      <FilterCard eventTypes={props.evtTypes} />
      <Table striped bordered size="sm" className="mt-2">
        <thead>
          <tr>
            <th className="small-col">Date</th>
            <th className="small-col">Time</th>
            <th className="big-col">Event</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </Table>
    </>
  );
}

function TableRow(props) {
  return (
    <tr {...(props.formatting && JSON.parse(props.formatting))}>
      <td className="small-col">{props.date}</td>
      <td className="small-col">{props.time}</td>
      <td className="big-col">{props.event}</td>
    </tr>
  );
}

function FilterCard(props) {
  return (
    <Card border="primary" className="mt-3">
      <Card.Header>Filter Events:</Card.Header>
      <Card.Body>
        <Form>
          {/* Date (range?)  */}
          {/* Event Type  */}
          {/* Groups (by day, week?, month&year, year?)  */}
          {/* Time range?  */}
          <Form.Group as={Row} controlId="inputTime">
            <Form.Label column xs="auto">
              Time (if not now):
            </Form.Label>
            <Col>
              <Form.Control type="time" />
            </Col>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default History;

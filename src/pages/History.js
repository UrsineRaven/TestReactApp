import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import EventTypeSelector from '../components/EventTypeSelector';
import { getLocalIsoString } from '../components/Helpers';
import PageHeading from '../components/PageHeading';

function History(props) {
  const [type, setType] = useState('');
  const [startDate, setStartDate] = useState('2000-01-01');
  const [endDate, setEndDate] = useState(
    getLocalIsoString(new Date()).split('T')[0]
  );

  const eventTypes = {};
  props.evtTypes.forEach(type => {
    eventTypes[type.id] = {
      name: type.name,
      formatting: type.formatting
    };
  });

  const tableRows = props.rows
    .filter(row => {
      const evtType = type ? row.event === type : true;
      const evtStartDate = startDate ? row.date >= startDate : true;
      const evtEndDate = endDate ? row.date <= endDate : true;
      return evtType && evtStartDate && evtEndDate;
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
      <PageHeading>Event History</PageHeading>
      <FilterCard
        eventTypes={props.evtTypes}
        typeValue={type}
        typeChange={newType => setType(newType)}
        startDate={startDate}
        startDateChange={newDate => setStartDate(newDate)}
        endDate={endDate}
        endDateChange={newDate => setEndDate(newDate)}
      />
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
    <Card border="primary">
      <Card.Header>Filter Events:</Card.Header>
      <Card.Body>
        <Form>
          <EventTypeSelector
            evtTypes={props.eventTypes}
            value={props.typeValue}
            onChange={newType => props.typeChange(newType.id)}
            defaultLabel="Any Event Type"
            inline
          />
          <Form.Group as={Row} controlId="inputEndDate">
            <Form.Label column xs="auto">
              Newest Date
            </Form.Label>
            <Col>
              <Form.Control
                type="date"
                value={props.endDate}
                onChange={newDate => props.endDateChange(newDate.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="inputStartDate">
            <Form.Label column xs="auto">
              Oldest Date
            </Form.Label>
            <Col>
              <Form.Control
                type="date"
                value={props.startDate}
                onChange={newDate =>
                  props.startDateChange(newDate.target.value)
                }
              />
            </Col>
          </Form.Group>
          {/* TODO: Groups (by day, week?, month&year, year?) */}
          {/* TODO: Time range? */}
        </Form>
      </Card.Body>
    </Card>
  );
}

export default History;

import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import EventTypeSelector from '../components/EventTypeSelector';
import {
  getLocalIsoDateAndTime,
  getLocalIsoString,
  getStartAndEndDatetimes,
  getWeekNumber,
  getWeekStartAndEnd
} from '../helpers/TimeHelpers';
import PageHeading from '../components/PageHeading';
import TableRow from '../components/TableRow';
import '../styles/Table.css';

function History(props) {
  const [type, setType] = useState('');
  const [startDate, setStartDate] = useState('2000-01-01');
  const [endDate, setEndDate] = useState(
    getLocalIsoString(new Date()).split('T')[0]
  );
  const [groupBy, setGroupBy] = useState('');

  const eventTypes = {};
  props.evtTypes.forEach(type => {
    eventTypes[type.id] = {
      name: type.name,
      formatting: type.formatting
    };
  });

  // filter rows and sort descending by date and time
  const [startDatetime, endDatetime] = getStartAndEndDatetimes(
    startDate,
    endDate
  );
  let processedRows = props.rows
    .filter(row => {
      const evtType = type ? row.event === type : true;
      const evtStartDate = startDatetime ? row.datetime >= startDatetime : true;
      const evtEndDate = endDatetime ? row.datetime <= endDatetime : true;
      return evtType && evtStartDate && evtEndDate;
    })
    .sort((row1, row2) => row2.datetime - row1.datetime);

  // add grouping rows
  let currentGroup = '';
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]; // TODO: use internationalization API once it's more supported (https://stackoverflow.com/a/18648314) (https://caniuse.com/#search=intl)
  processedRows.forEach((row, index) => {
    if (groupBy) {
      let date, day;
      switch (groupBy) {
        case 'day':
          date = new Date(row.datetime);
          [day] = getLocalIsoDateAndTime(date);
          if (currentGroup !== day) {
            currentGroup = day;
            processedRows.splice(index, 0, {
              group: date.toDateString()
            });
          }
          break;
        case 'week':
          date = new Date(row.datetime);
          [day] = getLocalIsoDateAndTime(date);
          const [wYear, wNo] = getWeekNumber(day);
          const weekYear = wYear + '-' + wNo;
          if (currentGroup !== weekYear) {
            currentGroup = weekYear;
            const [begin, end] = getWeekStartAndEnd(day);
            processedRows.splice(index, 0, {
              group: `Week of: ${begin.toDateString()} - ${end.toDateString()}`
            });
          }
          break;
        case 'month':
          date = new Date(row.datetime);
          [day] = getLocalIsoDateAndTime(date);
          const monthYear = day.slice(0, 7);
          if (currentGroup !== monthYear) {
            currentGroup = monthYear;
            processedRows.splice(index, 0, {
              group: monthNames[date.getMonth()] + ' ' + day.split('-')[0]
            });
          }
          break;
        case 'year':
          date = new Date(row.datetime);
          [day] = getLocalIsoDateAndTime(date);
          const year = day.split('-')[0];
          if (currentGroup !== year) {
            currentGroup = year;
            processedRows.splice(index, 0, {
              group: year
            });
          }
          break;
        default:
          break;
      }
    }
  });

  // convert rows to JSX
  const tableRows = processedRows.map(row => {
    let tableRow;
    if (row.group) {
      tableRow = <GroupRow groupName={row.group} />;
    } else {
      const [date, time] = getLocalIsoDateAndTime(new Date(row.datetime));
      tableRow = (
        <TableRow
          noBtn
          date={date}
          time={time}
          event={eventTypes[row.event].name}
          formatting={eventTypes[row.event].formatting}
          key={row.id}
        />
      );
    }
    return tableRow;
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
        groupBy={groupBy}
        groupByChange={newGroup => setGroupBy(newGroup)}
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

function GroupRow(props) {
  return (
    <tr className="table-dark" style={{ fontWeight: 'bold' }}>
      <td colSpan="3">{props.groupName}</td>
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
          <Form.Group as={Row} controlId="chooseGrouping">
            <Form.Label column xs="auto">
              Group By
            </Form.Label>
            <Form.Control
              as="select"
              value={props.groupBy}
              // TODO: be more consistent with my anonymous handler function naming and structure
              onChange={evt => props.groupByChange(evt.target.value)}
              className="col mx-3"
              style={{ minWidth: '9rem' }}
            >
              <option value="">{'--- None ---'}</option>
              <option value="day">{'Day'}</option>
              <option value="week">{'Week'}</option>
              <option value="month">{'Month & Year'}</option>
              <option value="year">{'Year'}</option>
            </Form.Control>
          </Form.Group>
          {/* TODO: Time range? */}
        </Form>
      </Card.Body>
    </Card>
  );
}

export default History;

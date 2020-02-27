import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Table from 'react-bootstrap/Table';
import Tooltip from 'react-bootstrap/Tooltip';
import EventTypeSelector from '../components/FormElements/EventTypeSelector';
import InlineFormGroup from '../components/FormElements/InlineFormGroup';
import PageHeading from '../components/PageHeading';
import TableRow from '../components/TableRow';
import { getHumanReadableTimeSinceDatetime, getLocalIsoDateAndTime, getLocalIsoString, getStartAndEndDatetimes, getWeekNumber, getWeekStartAndEnd } from '../helpers/TimeHelpers';
import '../styles/Modal.css';
import '../styles/Table.css';

function History(props) {
  const [type, setType] = useState('');
  const [startDate, setStartDate] = useState('2000-01-01');
  const [endDate, setEndDate] = useState(
    getLocalIsoString(new Date()).split('T')[0]
  );
  const [groupBy, setGroupBy] = useState('');
  const [showNewEventModal, setShowNewEventModal] = useState(false);

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
  if (
    props.timeSinceFormat &&
    (typeof props.timeSinceFormat === 'boolean' ||
      props.timeSinceFormat.charAt(0) !== '►')
  )
    processedRows = processedRows.map(row => {
      return {
        timeSince: getHumanReadableTimeSinceDatetime(
          new Date(row.datetime),
          typeof props.timeSinceFormat === 'string' ? props.timeSinceFormat : ''
        ),
        ...row
      };
    });

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
  ]; // TODO: use internationalization API (https://stackoverflow.com/a/18648314)
  let j = processedRows.length;
  for (let i = 0; i < j; i++) {
    if (groupBy) {
      let date, day;
      const row = processedRows[i];
      const index = i;
      switch (groupBy) {
        case 'day':
          date = new Date(row.datetime);
          [day] = getLocalIsoDateAndTime(date);
          if (currentGroup !== day) {
            currentGroup = day;
            processedRows.splice(index, 0, {
              group: date.toDateString()
            });
            i++;
            j++;
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
            i++;
            j++;
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
            i++;
            j++;
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
            i++;
            j++;
          }
          break;
        default:
          break;
      }
    }
  }

  // convert rows to JSX
  const tableRows = processedRows.map(row => {
    let tableRow;
    if (row.group) {
      tableRow = <GroupRow groupName={row.group} key={row.group} />;
    } else {
      const [date, time] = getLocalIsoDateAndTime(new Date(row.datetime));
      tableRow = (
        <TableRow
          noBtn
          date={date}
          time={time}
          event={eventTypes[row.event].name}
          timeSince={row.timeSince}
          formatting={eventTypes[row.event].formatting}
          key={row.id}
        />
      );
    }
    return tableRow;
  });

  return (
    <>
      <PageHeading>
        Event History
        <Button
          variant="secondary"
          style={{ float: 'right' }}
          onClick={() => setShowNewEventModal(true)}
          title="Add Historical Event"
        >
          Add Event
        </Button>
      </PageHeading>
      <NewEventModal
        show={showNewEventModal}
        setShow={setShowNewEventModal}
        onSave={props.onNewEvent}
        eventTypes={props.evtTypes}
      />
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
            {props.timeSinceFormat &&
              (typeof props.timeSinceFormat === 'boolean' ||
                props.timeSinceFormat.charAt(0) !== '►') && (
                <th className="small-col">Time Since</th>
              )}
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
          <InlineFormGroup controlId="inputEndDate" label="Newest Date">
            <Form.Control
              type="date"
              value={props.endDate}
              onChange={newDate => props.endDateChange(newDate.target.value)}
            />
          </InlineFormGroup>
          <InlineFormGroup controlId="inputStartDate" label="Oldest Date">
            <Form.Control
              type="date"
              value={props.startDate}
              onChange={newDate => props.startDateChange(newDate.target.value)}
            />
          </InlineFormGroup>
          <InlineFormGroup controlId="chooseGrouping" label="Group By">
            <Form.Control
              as="select"
              value={props.groupBy}
              // TODO: be more consistent with my anonymous handler function naming and structure
              onChange={evt => props.groupByChange(evt.target.value)}
              style={{ minWidth: '9rem' }}
            >
              <option value="">{'--- None ---'}</option>
              <option value="day">{'Day'}</option>
              <option value="week">{'Week'}</option>
              <option value="month">{'Month & Year'}</option>
              <option value="year">{'Year'}</option>
            </Form.Control>
          </InlineFormGroup>
          {/* TODO: Time range? */}
        </Form>
      </Card.Body>
    </Card>
  );
}

// props: show, setShow, eventTypes, onSave
function NewEventModal(props) {
  const [type, setType] = useState();
  const [date, setDate] = useState();
  const [time, setTime] = useState();

  function handleDismiss(evt) {
    setType();
    setDate();
    setTime();
    props.setShow(false);
  }

  function handleSave(evt) {
    props.onSave(type, time, date);
    handleDismiss();
  }

  function validate() {
    let message = '';
    //(!type && type !== 0) || !date || !time
    if (!type && type !== 0) {
      message += 'Please select an event type';
    }
    if (!date) {
      if (message.length > 0) message += ' and ';
      else message += 'Please select ';
      message += 'a date';
    }
    if (!time) {
      if (message.length > 0) message += ' and ';
      else message += 'Please select ';
      message += 'a time';
    }
    return message;
  }

  return (
    <Modal show={props.show} onHide={handleDismiss} dialogClassName="modal-w">
      <Modal.Header closeButton>
        <Modal.Title>Add Historical Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <EventTypeSelector
            evtTypes={props.eventTypes}
            value={type}
            onChange={newType => setType(newType.id)}
            defaultLabel="Pick Event Type"
            inline
          />
          <InlineFormGroup controlId="inputDate" label="Date">
            <Form.Control
              type="date"
              value={date}
              onChange={newDate => setDate(newDate.target.value)}
            />
          </InlineFormGroup>
          <InlineFormGroup controlId="inputTime" label="Time:">
            <Form.Control
              type="time"
              value={time}
              onChange={newTime => setTime(newTime.target.value)}
            />
          </InlineFormGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer className="row justify-content-around">
        <Button
          variant="secondary"
          className="col-md-3 col-5"
          onClick={handleDismiss}
        >
          Cancel
        </Button>
        <OverlayTrigger
          overlay={
            <Tooltip hidden={!Boolean(validate())}>{validate()}</Tooltip>
          }
        >
          <span>
            <Button
              variant="primary"
              className="col-md-3 col-5"
              onClick={handleSave}
              disabled={Boolean(validate())}
              // This and the span are necessary for the ToolTip
              style={{
                minWidth: 'fit-content',
                ...(Boolean(validate()) && { pointerEvents: 'none' })
              }}
            >
              Save
            </Button>
          </span>
        </OverlayTrigger>
      </Modal.Footer>
    </Modal>
  );
}

export default History;

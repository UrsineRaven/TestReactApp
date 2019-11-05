import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import InlineFormGroup from '../components/FormElements/InlineFormGroup';
import PageHeading from '../components/PageHeading';
import TableRow from '../components/TableRow';
import { getLocalIsoDateAndTime, getTodaysStartAndEndDatetimes } from '../helpers/TimeHelpers';
import '../styles/Modal.css';
import '../styles/Table.css';

function Home(props) {
  const [updateTime, setUpdateTime] = useState(new Date().toLocaleString());
  const [modalInfo, setModalInfo] = useState('');

  useEffect(() => {
    setUpdateTime(new Date().toLocaleString());
  }, [props.rows, props.evtTypes]);

  const eventTypes = {};
  props.evtTypes.forEach(type => {
    eventTypes[type.id] = {
      name: type.name,
      formatting: type.formatting
    };
  });

  const [dayStart, dayEnd] = getTodaysStartAndEndDatetimes();
  let sortedFilteredRows = props.rows
    .filter(row => {
      return dayStart <= row.datetime && row.datetime <= dayEnd;
    })
    .sort(
      (row1, row2) => row2.datetime - row1.datetime // sort descending by date and time
    );

  // if there are no rows, insert a placeholder row
  if (!sortedFilteredRows.length)
    sortedFilteredRows = [
      {
        evtName: 'No Events yet for today',
        evtFormat:
          '{ ' +
          '  "className":"table-active", ' +
          '  "style": { ' +
          '    "fontStyle":"italic", ' +
          '    "textAlign":"center" ' +
          '  }' +
          '}',
        id: '',
        datetime: ''
      }
    ];

  const tableRows = sortedFilteredRows.map(row => {
    let evtName, evtFormat, evtTime;
    if (row.evtName && row.evtFormat) {
      evtName = row.evtName;
      evtFormat = row.evtFormat;
    } else {
      evtName = eventTypes[row.typeId || row.event].name;
      evtFormat = eventTypes[row.typeId || row.event].formatting;
    }
    evtTime = row.datetime
      ? getLocalIsoDateAndTime(new Date(row.datetime))[1]
      : '';
    return (
      <TableRow
        noDate
        time={evtTime}
        event={evtName}
        formatting={evtFormat}
        onDelete={() =>
          setModalInfo({
            deleteId: row.id,
            text: (
              <>
                {'Are you sure you want to delete '}
                <strong>{evtName}</strong>
                {' at '}
                <strong>{evtTime}</strong>?
              </>
            )
          })
        }
        key={row.id}
      />
    );
  });

  return (
    <>
      <PageHeading></PageHeading>
      <h5 className="mt-3">
        {'Page last updated: '}
        <small className="text-muted">{updateTime}</small>
        {!props.offlineOnly && (
          <Button
            variant="secondary"
            size="sm"
            style={{ float: 'right' }}
            onClick={props.onRefresh}
            title="Refresh the event list"
          >
            Refresh
          </Button>
        )}
      </h5>
      <NewEventCard eventTypes={props.evtTypes} evtClick={props.onNewEvent} />
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

      <Modal show={!!modalInfo}>
        <Modal.Header>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalInfo.text}</Modal.Body>
        <Modal.Footer className="row justify-content-around">
          <Button
            variant="danger"
            className="col-md-3 col-5"
            onClick={() => {
              props.onDeleteEvent(modalInfo.deleteId);
              setModalInfo('');
            }}
          >
            Yes
          </Button>
          <Button
            variant="primary"
            className="col-md-3 col-5"
            onClick={() => setModalInfo('')}
          >
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function NewEventCard(props) {
  const [time, setTime] = useState('');

  function handleNewEvent(id) {
    props.evtClick(id, time && time);
    setTime('');
  }

  const eventButtons = props.eventTypes.map(evt => {
    return (
      !evt.hidden && (
        <Button
          variant="secondary"
          title={'New ' + evt.name}
          key={evt.id}
          onClick={() => handleNewEvent(evt.id)}
          style={{ width: '100%' }}
          className="col-lg-2 col-md-3 col-sm-4 col-6"
        >
          {evt.name}
        </Button>
      )
    );
  });
  return (
    <Card border="primary">
      <Card.Header>New Events:</Card.Header>
      <Card.Body>
        <Form>
          <InlineFormGroup controlId="inputTime" label="Time (if not now):">
            <Form.Control
              type="time"
              value={time}
              onChange={newTime => setTime(newTime.target.value)}
            />
          </InlineFormGroup>
          <Row>{eventButtons}</Row>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default Home;

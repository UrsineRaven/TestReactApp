import React from 'react';
import { useState, useEffect } from 'react';
import './Home.css';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

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

  const tableRows = props.rows.map(row => {
    const evtName = eventTypes[row.event].name;
    return (
      <TableRow
        time={row.time}
        event={evtName}
        formatting={eventTypes[row.event].formatting}
        onDelete={() =>
          setModalInfo({
            deleteId: row.id,
            text: (
              <>
                {'Are you sure you want to delete '}
                <strong>{evtName}</strong>
                {' at '}
                <strong>{row.time}</strong>?
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
      <h5 className="mt-3">
        {'Page last updated: '}
        <small className="text-muted">{updateTime}</small>
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

function TableRow(props) {
  return (
    <tr {...(props.formatting && JSON.parse(props.formatting))}>
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

function NewEventCard(props) {
  const eventButtons = props.eventTypes.map(evt => {
    return (
      !evt.hidden && (
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
      )
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
              <Form.Control type="time" />
            </Col>
          </Form.Group>
          <Row>{eventButtons}</Row>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default Home;

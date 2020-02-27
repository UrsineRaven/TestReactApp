import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import EventTypeSelector from '../components/FormElements/EventTypeSelector';
import PageHeading from '../components/PageHeading';
import RowFormattingWizard from '../components/RowFormattingWizard';

function Types(props) {
  const [id, setId] = useState('');
  const [oldId, setOldId] = useState('');
  const [name, setName] = useState('');
  const [formatting, setFormatting] = useState('');
  const [deleteType, setDeleteType] = useState(false);
  const [newType, setNewType] = useState(true);
  const [alertText, setAlertText] = useState('');

  useEffect(() => {
    if (!id) {
      let newId = String(Math.max(...props.evtTypes.map(t => t.id), 0) + 1);
      // This is necessary, because with the database delay, it sometimes generates
      // the new ID before the new event type is in the event types list
      if (newId === oldId) newId += 1;
      setId(newId);
    }
  }, [id, oldId, props.evtTypes]);

  function handleTypeChange(type) {
    if (!type.id) setNewType(true);
    else setNewType(false);

    setName(type.name || '');
    setFormatting(type.formatting || '');
    setDeleteType(type.hidden || false);
    setId(type.id || '');
  }

  function handleSubmit() {
    const evt = {
      id: id,
      name: name,
      formatting: formatting,
      hidden: deleteType
    };
    props.onEditType(evt);

    setAlertText(
      <>
        {'Successfully modified '}
        <strong>{name}</strong>
        {' event type!'}
      </>
    );
    setName('');
    setFormatting('');
    setDeleteType(false);
    setNewType(true);
    setOldId(id);
    setId('');
  }

  const alerts = [
    {
      type: 'success',
      dismissible: true,
      onClose: () => setAlertText(''),
      text: alertText
    }
  ];

  return (
    <>
      <PageHeading alerts={alerts}>Event Type Management</PageHeading>
      <Card border="primary" className="mb-3">
        <Card.Body>
          <Form>
            <EventTypeSelector
              evtTypes={props.evtTypes}
              value={id}
              onChange={newEvtType => handleTypeChange(newEvtType)}
              description="Choose an event type if you want to modify an existing event."
              nofilter={props.showHidden}
            />
            <InputName
              value={name}
              onChange={newName => setName(newName)}
              disabled={deleteType}
            />
            <InputFormatting
              value={formatting}
              onChange={newFormatting => setFormatting(newFormatting)}
              disabled={deleteType}
            />
            <CheckDelete
              value={deleteType}
              onChange={newValue => setDeleteType(newValue)}
              show={!newType}
            />
            <Button variant="primary" onClick={() => handleSubmit()}>
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}

function InputName(props) {
  return (
    <Form.Group controlId="inputName">
      <Form.Label>Event Type Name</Form.Label>
      <Form.Control
        required
        type="text"
        placeholder="Enter the event type name"
        value={props.value}
        onChange={evt => props.onChange(evt.target.value)}
      />
    </Form.Group>
  );
}

function InputFormatting(props) {
  return (
    <Form.Group controlId="inputFormatting">
      <Form.Label>Event Type Formatting</Form.Label>
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Enter the event type formatting"
          value={props.value}
          onChange={evt => props.onChange(evt.target.value)}
        />
        <InputGroup.Append>
          <RowFormattingWizard
            formatting={props.value}
            setFormatting={props.onChange}
          />
        </InputGroup.Append>
      </InputGroup>
    </Form.Group>
  );
}

function CheckDelete(props) {
  return (
    props.show && (
      <Form.Group controlId="inputDelete">
        <Form.Label className="text-danger">Remove Event Type</Form.Label>
        <Form.Check
          type="checkbox"
          label="Hide this event type!"
          checked={props.value}
          onChange={evt => props.onChange(evt.target.checked)}
        />
      </Form.Group>
    )
  );
}

export default Types;

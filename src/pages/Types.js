import React from 'react';
import { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function Types(props) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [formatting, setFormatting] = useState('');
  const [deleteType, setDeleteType] = useState(false);
  const [newType, setNewType] = useState(true);
  const [alertText, setAlertText] = useState('');

  useEffect(() => {
    if (!id) setId(Math.max(...props.evtTypes.map(t => t.id), 0) + 1);
  }, [id, props.evtTypes]);

  function handleTypeChange(type) {
    if (!type.id) setNewType(true);
    else setNewType(false);

    setId(type.id || '');
    setName(type.name || '');
    setFormatting(type.formatting || '');
    setDeleteType(false);
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
    setId('');
    setName('');
    setFormatting('');
    setDeleteType(false);
    setNewType(true);
  }

  return (
    <>
      <Alert
        show={!!alertText}
        variant="success"
        dismissible
        onClose={() => setAlertText('')}
      >
        {alertText}
      </Alert>
      <Form className="mt-3">
        <fieldset>
          <legend>Event Type Management</legend>
          <SelectType
            evtTypes={props.evtTypes}
            value={id}
            onChange={newType => handleTypeChange(newType)}
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
        </fieldset>
      </Form>
    </>
  );
}

function SelectType(props) {
  let evtTypes = props.evtTypes.map(evt => {
    return (
      !evt.hidden && (
        <option value={evt.id} key={evt.id}>
          {evt.name}
        </option>
      )
    );
  });

  function handleChange(evt) {
    let type = props.evtTypes.find(t => t.id === evt.target.value);
    props.onChange(type || {});
  }

  return (
    <Form.Group controlId="chooseType">
      <Form.Label>Event Type</Form.Label>
      <Form.Control as="select" value={props.value} onChange={handleChange}>
        <option value="">{'--- Create New ---'}</option>
        {evtTypes}
      </Form.Control>
      <Form.Text as="small" className="muted">
        {'Choose an event type if you want to modify an existing event.'}
      </Form.Text>
    </Form.Group>
  );
}

function InputName(props) {
  function handleChange(evt) {
    props.onChange(evt.target.value);
  }

  return (
    <Form.Group controlId="inputName">
      <Form.Label>Event Type Name</Form.Label>
      <Form.Control
        required
        type="text"
        placeholder="Enter the event type name"
        value={props.value}
        onChange={handleChange}
      ></Form.Control>
    </Form.Group>
  );
}

function InputFormatting(props) {
  function handleChange(evt) {
    props.onChange(evt.target.value);
  }

  return (
    <Form.Group controlId="inputFormatting">
      <Form.Label>Event Type Formatting</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter the event type formatting"
        value={props.value}
        onChange={handleChange}
      ></Form.Control>
    </Form.Group>
  );
}

function CheckDelete(props) {
  function handleChange(evt) {
    props.onChange(evt.target.checked);
  }

  return (
    props.show && (
      <Form.Group controlId="inputDelete">
        <Form.Label className="text-danger">Remove Event Type</Form.Label>
        <Form.Check
          type="checkbox"
          label="Delete this event type!"
          checked={props.value}
          onChange={handleChange}
        ></Form.Check>
      </Form.Group>
    )
  );
}

export default Types;

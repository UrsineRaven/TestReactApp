import React from 'react';
import Form from 'react-bootstrap/Form';

/**
 * Form Selector for Event Types. Adds a default value (empty string) as the first option.
 * @param {Object} props - properties for the component
 * @param {{id:string, name:string}[]} props.evtTypes - Array of event types
 * @param {string} props.value - The selected value (id of event type)
 * @param {function} props.onChange - The function to run when the value changes
 * @param {string} [props.defaultLabel="Create New"] - The label to show for the default value (defaults to 'Create New')
 * @param {string} [props.description] - An optional description to display below the field
 */
function EventTypeSelector(props) {
  const defaultLabel = props.defaultLabel || 'Create New';
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
        <option value="">{'--- ' + defaultLabel + ' ---'}</option>
        {evtTypes}
      </Form.Control>
      {props.description && (
        <Form.Text as="small" className="muted">
          {props.description}
        </Form.Text>
      )}
    </Form.Group>
  );
}

export default EventTypeSelector;

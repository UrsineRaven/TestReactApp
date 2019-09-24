import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

/**
 * Form Selector for Event Types. Adds a default value (empty string) as the first option.
 * @param {Object} props - properties for the component
 * @param {{id:string, name:string}[]} props.evtTypes - Array of event types
 * @param {string} props.value - The selected value (id of event type)
 * @param {function} props.onChange - The function to run when the value changes
 * @param {string} [props.defaultLabel="Create New"] - The label to show for the default value (defaults to 'Create New')
 * @param {string} [props.description] - An optional description to display below the field
 * @param {boolean} [props.inline] - Make the form group one line. Defaults to false
 * @param {boolean} [props.nofilter] - Don't filter out hidden event types
 */
function EventTypeSelector(props) {
  const defaultLabel = props.defaultLabel || 'Create New';
  let evtTypes = props.evtTypes.map(evt => {
    return (
      (props.nofilter || !evt.hidden) && (
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
    <Form.Group controlId="chooseType" {...(props.inline && { as: Row })}>
      <Form.Label {...(props.inline && { column: true, xs: 'auto' })}>
        Event Type
      </Form.Label>
      <Form.Control
        as="select"
        value={props.value}
        onChange={handleChange}
        {...(props.inline && {
          className: 'col mx-3',
          style: { minWidth: '9rem' }
        })}
      >
        <option value="">{`--- ${defaultLabel} ---`}</option>
        {evtTypes}
      </Form.Control>
      {props.description && (
        <Form.Text as="small" className="text-muted">
          {props.description}
        </Form.Text>
      )}
    </Form.Group>
  );
}

export default EventTypeSelector;

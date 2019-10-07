import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

/**
 * Creates a responsive, inline form group.
 * @param {Object} props - the props object for InlineFormGroup
 * @param {string} props.controlId - the id for the control
 * @param {string} props.label - The label for the form group
 * @param {React.ReactNode} props.children - The control element for the form group (this is set by adding a control inside this element, not by passing it as a prop)
 */
function InlineFormGroup(props) {
  const firstChild = React.Children.toArray(props.children)[0]; // if more than one child is passed, only keep the first
  const control = React.cloneElement(firstChild, {
    className: ('col mx-3 ' + firstChild.props.className).trim()
  });
  return (
    <Form.Group as={Row} controlId={props.controlId}>
      <Form.Label column xs="auto">
        {props.label}
      </Form.Label>
      {control}
    </Form.Group>
  );
}

export default InlineFormGroup;

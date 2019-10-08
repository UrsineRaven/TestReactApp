import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import InlineFormGroup from '../FormElements/InlineFormGroup';

/**
 * Wizard page for selecting a table row's bootstrap base class.
 * @param {FormatWizardPageProps} props - the props object for the Choose Class wizard page
 */
function ChooseClass(props) {
  const stepName = 'Choose Class';
  const stepDescription =
    'Choosing a class allows you to set a starting point for your formatting.';
  const classPrefix = 'table-';
  const rowClasses = [
    'active',
    'danger',
    'dark',
    'info',
    'light',
    'primary',
    'secondary',
    'success',
    'warning'
  ];

  const [className, setClassName] = useState(getRowClass());

  function handleClassChange(newVal) {
    let formatting = Object.assign({}, props.formatting);
    let classes =
      (formatting.className && formatting.className.split(' ')) || [];
    classes.forEach((cls, idx) => {
      let index = rowClasses.findIndex(rc => classPrefix + rc === cls);
      if (index !== -1) classes.splice(idx, 1);
    });
    classes.push(newVal);
    const value = classes.join(' ');
    formatting.className = value;
    if (value === '') delete formatting.className;
    props.setFormatting(formatting);
    setClassName(newVal);
  }

  function getRowClass() {
    let classes =
      (props.formatting.className && props.formatting.className.split(' ')) ||
      [];
    for (let i = 0; i < classes.length; i++) {
      let index = rowClasses.findIndex(rc => classPrefix + rc === classes[i]);
      if (index !== -1) return classes[i];
    }
    return '';
  }

  const classOptions = rowClasses.map(name => {
    const title = name.charAt(0).toUpperCase() + name.substring(1);
    const value = classPrefix + name;
    return (
      <option key={value} value={value}>
        {title}
      </option>
    );
  });

  return (
    props.steps[props.curStep] === stepName && (
      <>
        <h5>{stepName}</h5>
        <span className="form-text">{stepDescription}</span>
        <Form className="mt-3">
          <InlineFormGroup controlId="inputClass" label="Class">
            <Form.Control
              as="select"
              value={className}
              onChange={evt => handleClassChange(evt.target.value)}
              style={{ minWidth: '9rem' }}
            >
              <option value="">{'--- None ---'}</option>
              {classOptions}
            </Form.Control>
          </InlineFormGroup>
        </Form>
      </>
    )
  );
}

export default ChooseClass;

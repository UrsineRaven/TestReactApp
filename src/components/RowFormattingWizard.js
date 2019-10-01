import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Button from 'react-bootstrap/Button';
import '../styles/Modal.css';
import '../styles/RowFormattingWizard.css';
import '../styles/Table.css';
import TableRow from './TableRow';
import { getLocalIsoDateAndTime } from './Helpers';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

function RowFormattingWizard(props) {
  const [showWizard, setShowWizard] = useState(false);
  const [curStep, setCurStep] = useState(0);
  const [formatting, setFormatting] = useState(parse(props.formatting));

  const steps = [
    'Choose Class',
    'Choose Font Style',
    'Choose Font Overrides',
    'Finish'
  ];

  function handleWizardBtn() {
    resetWizard();
    setShowWizard(prev => !prev);
  }

  function handleDismiss() {
    resetWizard();
    setShowWizard(false);
  }

  function handleDone() {
    props.setFormatting(formatting);
    handleDismiss();
  }

  // Handlers

  function parse(formattingString) {
    const obj = JSON.parse(props.formatting || '{}');
    return obj;
  }

  function resetWizard() {
    setCurStep(0);
    setFormatting(parse(props.formatting));
  }

  const breadcrumbs = steps.map((name, index) => {
    return (
      index <= curStep && (
        <Breadcrumb.Item
          {...(index === curStep && { active: true })}
          {...(index < curStep && { href: '#' })}
          key={name}
          onClick={evt => {
            evt.preventDefault();
            setCurStep(index);
          }}
        >
          {name}
        </Breadcrumb.Item>
      )
    );
  });
  const [date, time] = getLocalIsoDateAndTime(new Date());
  return (
    <>
      <Modal show={showWizard} onHide={handleDismiss} dialogClassName="modal-w">
        <Modal.Header closeButton>
          <Modal.Title>Row Formatting Wizard</Modal.Title>
        </Modal.Header>
        <Breadcrumb className="modal-breadcrumb">{breadcrumbs}</Breadcrumb>
        <Table className="example-row" bordered size="sm">
          <tbody>
            <TableRow
              date={date}
              event="Example event..."
              formatting={JSON.stringify(formatting)}
              onDelete={() => null}
              time={time}
            ></TableRow>
          </tbody>
        </Table>
        <Modal.Body>
          {/* Wizard pages */}
          <ChooseClass
            curStep={curStep}
            steps={steps}
            formatting={formatting}
            setFormatting={setFormatting}
          />
        </Modal.Body>
        <Modal.Footer className="row justify-content-around">
          {curStep > 0 && (
            <Button
              variant="secondary"
              className="col-md-3 col-5"
              onClick={() => setCurStep(curStep > 0 ? curStep - 1 : 0)}
            >
              Previous
            </Button>
          )}
          {curStep < steps.length - 1 && (
            <Button
              variant="primary"
              className="col-md-3 col-5"
              onClick={() =>
                setCurStep(
                  curStep < steps.length - 1 ? curStep + 1 : steps.length - 1
                )
              }
            >
              Next
            </Button>
          )}
          {curStep === steps.length - 1 && (
            <Button
              variant="primary"
              className="col-md-3 col-5"
              onClick={handleDone}
            >
              Finish
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      <Button variant="primary" onClick={() => handleWizardBtn()}>
        #
      </Button>
    </>
  );
}

function ChooseClass(props) {
  const [className, setClassName] = useState(props.formatting.className || '');

  const stepName = 'Choose Class';
  const stepDescription =
    'Choosing a class allows you to set a starting point for your formatting.';
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

  function handleClassChange(newVal) {
    let formatting = Object.assign({}, props.formatting);
    formatting.className = newVal;
    if (newVal === '') delete formatting.className;
    props.setFormatting(formatting);
    setClassName(newVal);
  }

  const classOptions = rowClasses.map(name => {
    const title = name.charAt(0).toUpperCase() + name.substring(1);
    const value = 'table-' + name;
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
          <Form.Group as={Row} controlId="inputEndDate">
            <Form.Label column xs="auto">
              Class
            </Form.Label>
            <Form.Control
              as="select"
              value={className}
              onChange={evt => handleClassChange(evt.target.value)}
              className="col mx-3"
              style={{ minWidth: '9rem' }}
            >
              <option value="">{'--- None ---'}</option>
              {classOptions}
            </Form.Control>
          </Form.Group>
        </Form>
      </>
    )
  );
}

function ChooseFontStyle(props) {
  // Font-style - italic
  // Font-weight - normal, bold, really bold (900)
  // color -
  // variant - small-caps
  // size (use em to allow smaller or larger)
}

// Choose class
// Choose font style (checkbox for override size/color)
// Choose font size (optional color override)

export default RowFormattingWizard;

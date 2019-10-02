import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Button from 'react-bootstrap/Button';
import '../styles/Modal.css';
import '../styles/RowFormattingWizard.css';
import '../styles/Table.css';
import TableRow from './TableRow';
import { isObjectEmpty } from '../helpers/MiscHelpers';
import { getLocalIsoDateAndTime } from '../helpers/TimeHelpers';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import ColorPicker from './ColorPicker';

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
          <ChooseFontStyle
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
          <Form.Group as={Row} controlId="inputClass">
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
  const [fontStyle, setFontStyle] = useState(
    (props.formatting.style && props.formatting.style.fontStyle === 'italic') ||
      ''
  );
  const [fontDecoration, setFontDecoration] = useState(
    (props.formatting.style && props.formatting.style.textDecoration) || ''
  );
  const [fontWeight, setFontWeight] = useState(
    (props.formatting.style && props.formatting.style.fontWeight) || ''
  );
  const [fontColor, setFontColor] = useState(
    (props.formatting.style && props.formatting.style.color) || ''
  );
  const [fontVariant, setFontVariant] = useState(
    (props.formatting.style &&
      props.formatting.style.fontVariant === 'small-caps') ||
      ''
  );
  const [fontSize, setFontSize] = useState(
    (props.formatting.style && props.formatting.style.fontSize) || ''
  );

  const stepName = 'Choose Font Style';
  const stepDescription = 'Select any changes you want to make to the font.';
  const weights = [
    { name: 'Normal', value: 'normal' },
    { name: 'Bold', value: 'bold' },
    { name: 'Really Bold', value: '900' }
  ];
  const sizes = [
    { name: 'Normal', value: 'inherit' },
    { name: 'Smaller', value: '0.75em' },
    { name: 'Larger', value: '1.25em' },
    { name: 'Much Larger', value: '1.5em' }
  ];
  const decorations = [
    { name: 'Underline', value: 'underline' },
    { name: 'Strike-Through', value: 'line-through' }
  ];

  function handleStyleChange(newVal) {
    const style = newVal ? 'italic' : '';
    let formatting = Object.assign({}, props.formatting);
    if (!formatting.style) formatting.style = {};
    formatting.style.fontStyle = style;
    if (style === '') delete formatting.style.fontStyle;
    if (isObjectEmpty(formatting.style)) delete formatting.style;
    props.setFormatting(formatting);
    setFontStyle(newVal);
  }

  function handleDecorationChange(changedDecoration, newVal) {
    let decoration = fontDecoration;
    const index = decoration.indexOf(changedDecoration);
    if (index === -1 && newVal) {
      if (changedDecoration === 'underline')
        decoration = changedDecoration + ' ' + decoration;
      else decoration = decoration + ' ' + changedDecoration;
    } else if (index !== -1 && !newVal) {
      decoration = decoration.replace(changedDecoration, '').trim();
    }
    let formatting = Object.assign({}, props.formatting);
    if (!formatting.style) formatting.style = {};
    formatting.style.textDecorationLine = decoration;
    if (decoration === '') delete formatting.style.textDecorationLine;
    if (isObjectEmpty(formatting.style)) delete formatting.style;
    props.setFormatting(formatting);
    setFontDecoration(decoration);
  }

  function handleWeightChange(newVal) {
    let formatting = Object.assign({}, props.formatting);
    if (!formatting.style) formatting.style = {};
    formatting.style.fontWeight = newVal;
    if (newVal === '') delete formatting.style.fontWeight;
    if (isObjectEmpty(formatting.style)) delete formatting.style;
    props.setFormatting(formatting);
    setFontWeight(newVal);
  }

  function handleColorChange(newVal) {
    // TODO: implement all this
    let formatting = Object.assign({}, props.formatting);
    if (!formatting.style) formatting.style = {};
    formatting.style.color = newVal;
    if (newVal === '') delete formatting.style.color;
    if (isObjectEmpty(formatting.style)) delete formatting.style;
    props.setFormatting(formatting);
    setFontColor(newVal);
  }

  function handleVariantChange(newVal) {
    const variant = newVal ? 'small-caps' : '';
    let formatting = Object.assign({}, props.formatting);
    if (!formatting.style) formatting.style = {};
    formatting.style.fontVariant = variant;
    if (variant === '') delete formatting.style.fontVariant;
    if (isObjectEmpty(formatting.style)) delete formatting.style;
    props.setFormatting(formatting);
    setFontVariant(newVal);
  }

  function handleSizeChange(newVal) {
    let formatting = Object.assign({}, props.formatting);
    if (!formatting.style) formatting.style = {};
    formatting.style.fontSize = newVal;
    if (newVal === '') delete formatting.style.fontSize;
    if (isObjectEmpty(formatting.style)) delete formatting.style;
    props.setFormatting(formatting);
    setFontSize(newVal);
  }

  const decorationOptions = decorations.map(d => {
    return (
      <Form.Group as={Row} controlId={'inputDecoration' + d.name} key={d.name}>
        <Form.Label column xs="auto">
          {d.name}
        </Form.Label>
        <Form.Check
          type="checkbox"
          label="Example Text"
          className={'col mx-3 check-label-' + d.value}
          checked={fontDecoration.indexOf(d.value) !== -1}
          onChange={evt => handleDecorationChange(d.value, evt.target.checked)}
        />
      </Form.Group>
    );
  });

  const weightOptions = weights.map(w => {
    return (
      <option key={w.name} value={w.value}>
        {w.name}
      </option>
    );
  });

  const sizeOptions = sizes.map(s => {
    return (
      <option key={s.name} value={s.value}>
        {s.name}
      </option>
    );
  });

  return (
    props.steps[props.curStep] === stepName && (
      <>
        <h5>{stepName}</h5>
        <span className="form-text">{stepDescription}</span>
        <Form className="mt-3">
          <Form.Group as={Row} controlId="inputStyle">
            <Form.Label column xs="auto">
              Italic
            </Form.Label>
            <Form.Check
              type="checkbox"
              label="Example Text"
              className="col mx-3"
              style={{ fontStyle: 'italic' }}
              checked={fontStyle}
              onChange={evt => handleStyleChange(evt.target.checked)}
            />
          </Form.Group>
          {decorationOptions}
          <Form.Group as={Row} controlId="inputFontWeight">
            <Form.Label column xs="auto">
              Font Weight
            </Form.Label>
            <Form.Control
              as="select"
              value={fontWeight}
              onChange={evt => handleWeightChange(evt.target.value)}
              className="col mx-3"
              style={{ minWidth: '9rem' }}
            >
              <option value="">{'--- No change ---'}</option>
              {weightOptions}
            </Form.Control>
          </Form.Group>
          <Form.Group as={Row} controlId="inputVariant">
            <Form.Label column xs="auto">
              Small Caps
            </Form.Label>
            <Form.Check
              type="checkbox"
              label="Example Text"
              className="col mx-3"
              style={{ fontVariant: 'small-caps' }}
              checked={fontVariant}
              onChange={evt => handleVariantChange(evt.target.checked)}
            />
          </Form.Group>
          <Form.Group as={Row} controlId="inputFontSize">
            <Form.Label column xs="auto">
              Font Size
            </Form.Label>
            <Form.Control
              as="select"
              value={fontSize}
              onChange={evt => handleSizeChange(evt.target.value)}
              className="col mx-3"
              style={{ minWidth: '9rem' }}
            >
              <option value="">{'--- No change ---'}</option>
              {sizeOptions}
            </Form.Control>
          </Form.Group>
          <Form.Group as={Row} controlId="inputFontColor">
            <Form.Label column xs="auto">
              Font Color
            </Form.Label>
            <ColorPicker
              value={fontColor}
              onChange={val => handleColorChange(val)}
              className="col mx-3"
              style={{ minWidth: '9rem' }}
            />
          </Form.Group>
        </Form>
      </>
    )
  );
}

// Choose class
// Choose font style (checkbox for override size/color)
// Choose row style (background color, text-align, animation?)
// Choose font size (optional color override)

export default RowFormattingWizard;

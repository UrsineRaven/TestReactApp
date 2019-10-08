import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { isObjectEmpty } from '../../helpers/MiscHelpers';
import AnimationSelect, { animations } from '../FormElements/AnimationSelect';
import ColorPicker from '../FormElements/ColorPicker';
import InlineFormGroup from '../FormElements/InlineFormGroup';

/**
 * Wizard page for selecting a table row's styling.
 * @param {FormatWizardPageProps} props - the props object for the Choose Row Style wizard page
 */
function ChooseRowStyle(props) {
  const stepName = 'Choose Row Style';
  const stepDescription = 'Select any changes you want to make to the row.';
  const alignments = [
    { name: 'Default', value: 'initial' },
    { name: 'Left', value: 'left' },
    { name: 'Center', value: 'center' },
    { name: 'Right', value: 'right' },
    { name: 'Justify', value: 'justify' }
  ];

  const [className, setClassName] = useState(getAnimationClass());
  const [backColor, setBackColor] = useState(
    (props.formatting.style && props.formatting.style.backgroundColor) || ''
  );
  const [textAlign, setTextAlign] = useState(props.formatting.textAlign || '');

  function handleColorChange(newVal) {
    let formatting = Object.assign({}, props.formatting);
    if (!formatting.style) formatting.style = {};

    // handle the class that makes the row columns honor the background color override
    let className = formatting.className || '';
    if (newVal && className.indexOf('honor-row-bg') === -1)
      className = className + ' honor-row-bg';
    else if (!newVal && className.indexOf('honor-row-bg') !== -1) {
      let classes = className.split(' ');
      for (let i = 0; i < classes.length; i++) {
        if (classes[i] === 'honor-row-bg') {
          classes.splice(i, 1);
          break;
        }
      }
      className = classes.join(' ');
    }
    formatting.className = className;
    if (!className) delete formatting.className;

    formatting.style.backgroundColor = newVal;
    if (newVal === '') delete formatting.style.backgroundColor;
    if (isObjectEmpty(formatting.style)) delete formatting.style;
    props.setFormatting(formatting);
    setBackColor(newVal);
  }

  function handleAlignChange(newVal) {
    let formatting = Object.assign({}, props.formatting);
    if (!formatting.style) formatting.style = {};
    formatting.style.textAlign = newVal;
    if (newVal === '') delete formatting.style.textAlign;
    if (isObjectEmpty(formatting.style)) delete formatting.style;
    props.setFormatting(formatting);
    setTextAlign(newVal);
  }

  function handleClassChange(newVal) {
    let formatting = Object.assign({}, props.formatting);
    let classes =
      (formatting.className && formatting.className.split(' ')) || [];
    for (let i = 0; i < classes.length; i++) {
      let index = animations.findIndex(a => a.className === classes[i]);
      if (index !== -1) {
        classes.splice(i, 1);
        break;
      }
    }
    classes.push(newVal);
    const value = classes.join(' ');
    formatting.className = value;
    if (value === '') delete formatting.className;
    props.setFormatting(formatting);
    setClassName(newVal);
  }

  function getAnimationClass() {
    let classes =
      (props.formatting.className && props.formatting.className.split(' ')) ||
      [];
    for (let i = 0; i < classes.length; i++) {
      let index = animations.findIndex(a => a.className === classes[i]);
      if (index !== -1) return classes[i];
    }
    return '';
  }

  const alignOptions = alignments.map(a => {
    return (
      <option key={a.name} value={a.value}>
        {a.name}
      </option>
    );
  });

  return (
    props.steps[props.curStep] === stepName && (
      <>
        <h5>{stepName}</h5>
        <span className="form-text">{stepDescription}</span>
        <Form className="mt-3">
          <InlineFormGroup
            controlId="inputBackgroundColor"
            label="Background Color"
          >
            <ColorPicker
              value={backColor}
              onChange={val => handleColorChange(val)}
              style={{ minWidth: '9rem' }}
            />
          </InlineFormGroup>
          <InlineFormGroup controlId="inputTextAlign" label="Text Alignment">
            <Form.Control
              as="select"
              value={textAlign}
              onChange={evt => handleAlignChange(evt.target.value)}
              style={{ minWidth: '9rem' }}
            >
              <option value="">{'--- No change ---'}</option>
              {alignOptions}
            </Form.Control>
          </InlineFormGroup>
          <InlineFormGroup controlId="inputAnimation" label="Animation">
            <AnimationSelect
              value={className}
              onChange={val => handleClassChange(val)}
              style={{ minWidth: '9rem' }}
            />
          </InlineFormGroup>
        </Form>
      </>
    )
  );
}

export default ChooseRowStyle;

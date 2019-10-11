import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { isObjectEmpty } from '../../helpers/MiscHelpers';
import '../../styles/ChooseFontStyle.css';
import ColorPicker from '../FormElements/ColorPicker';
import InlineFormGroup from '../FormElements/InlineFormGroup';

/**
 * Wizard page for selecting a table row's font styling.
 * @param {FormatWizardPageProps} props - the props object for the Choose Font Style wizard page
 */
function ChooseFontStyle(props) {
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

  const [fontStyle, setFontStyle] = useState(
    (props.formatting.style && props.formatting.style.fontStyle === 'italic') ||
      ''
  );
  const [fontDecoration, setFontDecoration] = useState(
    (props.formatting.style && props.formatting.style.textDecorationLine) || ''
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
      <InlineFormGroup
        controlId={'inputDecoration' + d.name}
        label={d.name}
        key={d.name}
      >
        <Form.Check
          type="checkbox"
          label="Example Text"
          className={'check-label-' + d.value}
          checked={fontDecoration.indexOf(d.value) !== -1}
          onChange={evt => handleDecorationChange(d.value, evt.target.checked)}
        />
      </InlineFormGroup>
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
          <InlineFormGroup controlId="inputStyle" label="Italic">
            <Form.Check
              type="checkbox"
              label="Example Text"
              style={{ fontStyle: 'italic' }}
              checked={fontStyle}
              onChange={evt => handleStyleChange(evt.target.checked)}
            />
          </InlineFormGroup>
          {decorationOptions}
          <InlineFormGroup controlId="inputFontWeight" label="Font Weight">
            <Form.Control
              as="select"
              value={fontWeight}
              onChange={evt => handleWeightChange(evt.target.value)}
              style={{ minWidth: '9rem' }}
            >
              <option value="">{'--- No change ---'}</option>
              {weightOptions}
            </Form.Control>
          </InlineFormGroup>
          <InlineFormGroup controlId="inputVariant" label="Small Caps">
            <Form.Check
              type="checkbox"
              label="Example Text"
              style={{ fontVariant: 'small-caps' }}
              checked={fontVariant}
              onChange={evt => handleVariantChange(evt.target.checked)}
            />
          </InlineFormGroup>
          <InlineFormGroup controlId="inputFontSize" label="Font Size">
            <Form.Control
              as="select"
              value={fontSize}
              onChange={evt => handleSizeChange(evt.target.value)}
              style={{ minWidth: '9rem' }}
            >
              <option value="">{'--- No change ---'}</option>
              {sizeOptions}
            </Form.Control>
          </InlineFormGroup>
          <InlineFormGroup controlId="inputFontColor" label="Font Color">
            <ColorPicker
              value={fontColor}
              onChange={val => handleColorChange(val)}
              style={{ minWidth: '9rem' }}
            />
          </InlineFormGroup>
        </Form>
      </>
    )
  );
}

export default ChooseFontStyle;

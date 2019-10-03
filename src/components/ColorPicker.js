import React, { useState, useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { cssColors } from '../helpers/CssColors';
import Form from 'react-bootstrap/Form';
import CssColorSelect from './CssColorSelect';

/**
 * A color picker that allows you to choose one of the CSS-defined colors or a custom one.
 * @param {Object} props - properties object for the Color Picker
 * @param {string} props.value - value of the color picker
 * @param {(colorValue:string) => void} props.onChange - function to call when a color is chosen (saved)
 * @param {string} props.className - value to add to the className property of the rendered component
 * @param {Object} props.style - style object to apply to the rendered component
 */
function ColorPicker(props) {
  const defaultName = ' --- No Change ---';
  const previewSize = '1.5em';

  const [colorName, setColorName] = useState(defaultName);
  const [colorValue, setColorValue] = useState(props.value);
  const [showPicker, setShowPicker] = useState(false);
  const originalColor = useRef('');
  useEffect(() => {
    setColor(props.value);
  }, [props.value]); // may need to add setColor, or setColorValue and setColorName to the dependency list

  function handleClick() {
    if (!showPicker) originalColor.current = colorValue;
    setShowPicker(prev => !prev);
  }

  function handleDismiss(evt) {
    evt.stopPropagation();
    reset();
    setShowPicker(false);
  }

  function handleSave() {
    props.onChange(colorValue);
    setShowPicker(false);
  }

  function handleReset() {
    if (originalColor.current !== colorValue) reset();
    else setColor('');
  }

  function reset() {
    setColor(originalColor.current);
  }

  function setColor(val) {
    // TODO: make cssColors a class and move this to it and name it findName
    let value = val.toLowerCase();
    if (value.startsWith('#')) value = value.substring(1);
    const index = cssColors.findIndex(color => {
      return color.colorString === value || color.hex.toLowerCase() === value;
    });
    if (index !== -1) setColorName(cssColors[index].name);
    else setColorName(val.toUpperCase() || defaultName);
    setColorValue(val);
  }

  function getHexColor(val) {
    let value = val.toLowerCase();
    if (val.startsWith('#')) return val;
    const index = cssColors.findIndex(color => {
      return color.colorString === value;
    });
    if (index !== -1) return '#' + cssColors[index].hex.toLowerCase();
    return '#000000';
  }

  return (
    <div
      className={props.className + ' control-column'}
      style={{ flexDirection: 'column', ...props.style }}
    >
      <Modal.Dialog
        style={{ display: showPicker ? 'block' : 'none' }}
        className="modal-w inline-modal"
      >
        <Modal.Header>
          <Modal.Title>Color Picker</Modal.Title>
        </Modal.Header>
        <div style={{ height: '1em', backgroundColor: colorValue }} />
        <Modal.Body>
          <Form className="mt-3">
            {' '}
            {/* TODO: figure out if the form element is necessary if this is used outside a form... */}
            <Form.Group controlId="inputDefinedColor">
              <Form.Label>Choose a pre-defined color</Form.Label>
              <CssColorSelect
                value={colorValue}
                onChange={newVal => setColor(newVal)}
              />
            </Form.Group>
            <Form.Group controlId="inputCustomColor">
              <Form.Label>Or choose a custom color</Form.Label>
              <Form.Control
                type="color"
                value={getHexColor(colorValue)}
                onChange={evt => setColor(evt.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="row justify-content-around">
          <Button
            variant="secondary"
            className="col-md-3 col-sm-5 col-7"
            onClick={handleDismiss}
          >
            Cancel
          </Button>
          <Button
            variant="info"
            className="col-md-3 col-sm-5 col-7"
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            variant="primary"
            className="col-md-3 col-sm-5 col-7"
            onClick={handleSave}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
      <Button variant="light" onClick={handleClick}>
        <span
          className="align-middle d-inline-block"
          style={{
            border: '1px solid currentColor',
            backgroundColor: colorValue,
            width: previewSize,
            height: previewSize
          }}
        />
        <span className="ml-2 align-middle d-inline-block no-xform-upper">
          {colorName}
        </span>
      </Button>
    </div>
  );
}

export default ColorPicker;

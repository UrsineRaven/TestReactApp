import React from 'react';
import CssColors, { cssColors } from '../helpers/CssColors';
import '../styles/CssColorSelect.css';
import CustomSelect from './CustomSelect';

/**
 * A custom selector that lets you choose one of the CSS-defined colors.
 * @param {Object} props - properties object for CssColorSelect
 * @param {(colorValue:string) => void} props.onChange - function to call when a color is chosen
 * @param {string} props.value - The value of the selector
 */
function CssColorSelect(props) {
  function handleSelect(color) {
    if (color.colorString !== undefined || color.emptyString) {
      props.onChange(color.emptyString ? '' : color.colorString);
    }
  }

  function filter(color, filterText) {
    return (
      (color.colorString === undefined &&
        color.name.toLowerCase().indexOf(filterText) !== -1) ||
      color.colorString.indexOf(filterText) !== -1 ||
      color.category.indexOf(filterText) !== -1
    );
  }

  // Generate Color List
  //  sort
  const options = cssColors.concat([]).sort((c1, c2) => {
    if (c1.category < c2.category) return -1;
    if (c1.category > c2.category) return 1;
    if (c1.colorString < c2.colorString) return -1;
    if (c1.colorString > c2.colorString) return 1;
    return 0;
  });
  //  insert groups
  let lastGroup = '';
  options.forEach((color, index) => {
    if (color.category !== lastGroup) {
      lastGroup = color.category;
      options.splice(index, 0, {
        name: lastGroup
      });
    }
  });

  const items = options.map(color => {
    const back = color.colorString || 'black';
    const text = color.textColor || 'white';
    const style = color.colorString
      ? {}
      : {
          fontWeight: 'bold',
          textAlign: 'center',
          textDecorationLine: 'underline',
          borderStyle: 'none'
        };
    return {
      name: color.name,
      props: {
        className: 'entry',
        style: {
          color: text,
          backgroundColor: back,
          borderColor: text,
          ...style
        }
      },
      object: color
    };
  });

  return (
    <CustomSelect
      value={props.value}
      items={items}
      handleSelect={handleSelect}
      filter={filter}
      findItem={CssColors.findColor}
      findItemName={CssColors.findName}
    />
  );
}

export default CssColorSelect;

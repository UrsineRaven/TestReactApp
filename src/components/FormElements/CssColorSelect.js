import React from 'react';
import CssColors, { cssColors } from '../../helpers/CssColors';
import CustomSelect from './CustomSelect';

/**
 * A custom selector that lets you choose one of the CSS-defined colors.
 * @param {Object} props - properties object for CssColorSelect
 * @param {(colorValue:string) => void} props.onChange - function to call when a color is chosen
 * @param {string} props.value - The value of the selector
 */
function CssColorSelect(props) {
  function handleSelect(color) {
    if (color.colorString !== undefined) {
      props.onChange(color.colorString);
      return true;
    } else if (props.emptyString) {
      props.onChange('');
    }
    return false;
  }

  function filter(color, lowerCaseFilterText) {
    const colorStringMatches =
      color.colorString.indexOf(lowerCaseFilterText) !== -1;
    const categoryMatches =
      color.category.toLowerCase().indexOf(lowerCaseFilterText) !== -1;
    return colorStringMatches || categoryMatches;
  }

  function insertGroups(colorItems) {
    let lastGroup = '';
    colorItems.forEach((colorItem, index) => {
      if (colorItem.object.category !== lastGroup) {
        lastGroup = colorItem.object.category;
        colorItems.splice(index, 0, {
          name: lastGroup,
          props: {
            className: 'entry',
            style: {
              color: 'white',
              backgroundColor: 'black',
              borderColor: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              textDecorationLine: 'underline',
              borderStyle: 'none'
            }
          },
          object: { name: lastGroup }
        });
      }
    });
  }

  // Sort color list by Category then Name
  const options = cssColors.concat([]).sort((c1, c2) => {
    if (c1.category < c2.category) return -1;
    if (c1.category > c2.category) return 1;
    if (c1.colorString < c2.colorString) return -1;
    if (c1.colorString > c2.colorString) return 1;
    return 0;
  });

  const items = options.map(color => {
    return {
      name: color.name,
      props: {
        className: 'entry',
        style: {
          color: color.textColor,
          backgroundColor: color.colorString,
          borderColor: color.textColor
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
      insertGroups={insertGroups}
      findItem={CssColors.findColor}
      findItemName={CssColors.findName}
    />
  );
}

export default CssColorSelect;

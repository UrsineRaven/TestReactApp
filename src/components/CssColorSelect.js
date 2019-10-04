import React, { useEffect, useState } from 'react';
import CssColors, { cssColors } from '../helpers/CssColors';
import '../styles/CssColorSelect.css';

/**
 * A custom selector that lets you choose one of the CSS-defined colors.
 * @param {Object} props - properties object for CssColorSelect
 * @param {(colorValue:string) => void} props.onChange - function to call when a color is chosen
 * @param {string} props.value - The value of the selector
 */
function CssColorSelect(props) {
  const [filterText, setFilterText] = useState('');
  const [inputFocus, setInputFocus] = useState(false);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    setFilterText(CssColors.findName(props.value));
  }, [props.value]);

  function handleSelect(color) {
    if (color.colorString !== undefined) {
      props.onChange(color.colorString);
      setShowList(false);
    }
  }

  function handleBlur(evt) {
    // TODO: allow entering hex values
    let value = evt.target.value;

    // Handle empty string
    if (!value) {
      handleSelect({ colorString: '' });
      setInputFocus(false);
      return;
    }

    // Set value if valid, otherwise reset filterText
    const color = CssColors.findColor(value);
    if (color) handleSelect(color);
    else setFilterText(CssColors.findName(props.value));

    setShowList(false);
    setInputFocus(false);
  }

  let colorOptions;
  if (showList) {
    // Generate Color List
    const lowerFilter = filterText.toLowerCase();
    //  filter and sort
    const options = cssColors
      .filter(color => {
        return (
          color.colorString.indexOf(lowerFilter) !== -1 ||
          color.category.indexOf(lowerFilter) !== -1
        );
      })
      .sort((c1, c2) => {
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
    //  generate JSX
    colorOptions = options.map(color => {
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
      return (
        <li
          key={color.name}
          className="entry"
          style={{
            color: text,
            backgroundColor: back,
            borderColor: text,
            ...style
          }}
          onMouseDown={evt => evt.preventDefault()} // Ensures onClick is called before onBlur is called on the input
          onClick={() => handleSelect(color)}
        >
          {color.name}
        </li>
      );
    });
  } else {
    colorOptions = [];
  }

  return (
    <>
      <div className={'css-color-select' + (showList ? ' show-list' : '')}>
        <input
          type="text"
          className="form-control"
          value={filterText}
          onChange={evt => setFilterText(evt.target.value)}
          onFocus={evt => {
            setShowList(true);
            setInputFocus(true);
          }}
          onBlur={evt => handleBlur(evt)}
          onKeyDown={evt => {
            if (evt.key === 'Escape') setShowList(false);
          }}
          onClick={evt => {
            if (inputFocus) setShowList(true);
          }}
        />
        <span
          className="arrow"
          onClick={evt => {
            setShowList(val => !val);
            evt.preventDefault();
          }}
          onMouseDown={evt => evt.preventDefault()}
        >
          {showList ? <>&#128897;</> : <>&#128899;</>}
        </span>
        <ul className="dropdown">{colorOptions}</ul>
      </div>
    </>
  );
}

export default CssColorSelect;

import React, { useEffect, useState } from 'react';
import '../../styles/CustomSelect.css';

/**
 * A custom selector that lets you choose one of a few pre-defined items.
 * @template OBJ - the list item object
 * @template VAL - the type of the item's value
 * @param {Object} props - properties object for CustomSelect
 * @param {VAL} props.value - The value of the selector
 * @param {Array<{name:string, props:FormattingObject, object:OBJ}>} props.items - The list of objects needed to generate the option list
 * @param {(item:OBJ, filter:string) => boolean} props.filter - Returns whether the item should be included based on the filter text (filter text is converted to all lowercase before it's passed).
 * @param {(itemList:Array<{name:string, props:FormattingObject, object:OBJ}>) => void} [props.insertGroups] - Adds group label items to the list of options.
 * @param {(itemValue:VAL) => OBJ} props.findItem - Returns the item object that matches the value.
 * @param {(itemValue:VAL) => string} props.findItemName - Returns the name of the item matching the value.
 * @param {(item:OBJ) => boolean} props.handleSelect - Performs any logic that needs to happen when an item is selected and returns true if the list should be hidden (a valid option was clicked). It is passed an object with emptyString set to true if the value is empty.
 */
function CustomSelect(props) {
  const [filterText, setFilterText] = useState('');
  const [showList, setShowList] = useState(false);
  const [blurring, setBlurring] = useState(false);

  // Make sure filter text reflects the current value
  const findItemName = props.findItemName;
  const propValue = props.value;
  useEffect(() => {
    setFilterText(findItemName(propValue));
  }, [findItemName, propValue]);

  // Make sure to hide the menu when focus leaves the input
  useEffect(() => {
    if (blurring) {
      setShowList(false);
      setBlurring(false);
    }
  }, [blurring, setShowList, setBlurring]);

  function handleSelect(item) {
    const hideList = props.handleSelect(item);
    setShowList(!hideList);
  }

  function handleBlur(evt) {
    setBlurring(true);
    let value = evt.target.value.toLowerCase();
    // Handle empty string
    if (!value) {
      handleSelect({ emptyString: true });
      return;
    }

    // Set value if valid, otherwise reset filterText
    const item = props.findItem(value);
    if (item) handleSelect(item);
    else setFilterText(props.findItemName(props.value));
  }

  // Generate JSX
  const lowerFilter = filterText.toLowerCase();
  let listItems = props.items.filter(item => {
    return props.filter(item.object, lowerFilter);
  });
  if (props.insertGroups) props.insertGroups(listItems);
  const listOptions = listItems.map(item => {
    return (
      <li
        key={item.name}
        {...item.props}
        onMouseDown={evt => evt.preventDefault()} // Ensures onClick is called before onBlur is called on the input
        onClick={() => handleSelect(item.object)}
      >
        {item.name}
      </li>
    );
  });

  return (
    <>
      <div
        className={'custom-select-component' + (showList ? ' show-list' : '')}
      >
        <input
          type="text"
          className="form-control"
          value={filterText}
          onChange={evt => setFilterText(evt.target.value)}
          onFocus={evt => setShowList(true)}
          onBlur={evt => handleBlur(evt)}
          onKeyDown={evt => {
            if (evt.key === 'Escape') setShowList(false);
          }}
          onClick={evt => setShowList(true)}
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
        <ul className="dropdown">{listOptions}</ul>
      </div>
    </>
  );
}

export default CustomSelect;

import React, { useState, useEffect } from 'react';
import '../styles/AnimationSelect.css';

/**
 * Array of available animations
 */
export const animations = [
  {
    name: 'Important!',
    className: 'ani-important'
  },
  {
    name: 'Loading',
    className: 'ani-loading'
  },
  {
    name: 'Throbbing',
    className: 'ani-throbbing'
  }
];

/**
 * A custom selector that lets you choose one of a few pre-defined animations.
 * @param {Object} props - properties object for AnimationSelect
 * @param {(animationStyle:string) => void} props.onChange - function to call when an animation is chosen
 * @param {string} props.value - The value of the selector
 */
function AnimationSelect(props) {
  const [filterText, setFilterText] = useState('');
  const [inputFocus, setInputFocus] = useState(false);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    let newValue = props.value.toLowerCase();
    const index = animations.findIndex(animation => {
      return animation.className === newValue;
    });
    if (index !== -1) setFilterText(animations[index].name);
    else setFilterText('');
  }, [props.value]);

  function handleSelect(animation) {
    props.onChange(animation.className);
    setShowList(false);
  }

  function handleBlur(evt) {
    // Set value if text is valid
    let value = evt.target.value.toLowerCase();
    //  handle empty string
    if (!value) {
      handleSelect({ className: '' });
      setInputFocus(false);
      return;
    }
    //  check if value is valid
    let index = animations.findIndex(animation => {
      return animation.name.toLowerCase() === value;
    });
    if (index !== -1) handleSelect(animations[index]);
    else {
      //  set filter text equal to the last valid value
      let oldValue = props.value.toLowerCase();
      let index = animations.findIndex(animation => {
        return animation.className === oldValue;
      });
      if (index !== -1) setFilterText(animations[index].name);
      else setFilterText('');
    }

    setShowList(false);
    setInputFocus(false);
  }

  // Generate JSX
  const lowerFilter = filterText.toLowerCase();
  const animationOptions = animations
    .filter(animation => {
      return (
        animation.name.toLowerCase().indexOf(lowerFilter) !== -1 ||
        animation.className.toLowerCase().indexOf(lowerFilter) !== -1
      );
    })
    .map(animation => {
      return (
        <li
          key={animation.name}
          className={'entry ' + animation.className}
          onMouseDown={evt => evt.preventDefault()} // Ensures onClick is called before onBlur is called on the input
          onClick={() => handleSelect(animation)}
        >
          {animation.name}
        </li>
      );
    });

  return (
    <>
      <div className={'css-animation-select' + (showList ? ' show-list' : '')}>
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
        <ul className="dropdown">{animationOptions}</ul>
      </div>
    </>
  );
}

export default AnimationSelect;

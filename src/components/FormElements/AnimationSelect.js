import React from 'react';
import '../../styles/AnimationSelect.css';
import CustomSelect from './CustomSelect';

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
  function handleSelect(animation) {
    if (animation.emptyString) {
      props.onChange('');
      return false;
    }
    props.onChange(animation.className);
    return true;
  }

  function filter(animation, lowerCaseFilterText) {
    return (
      animation.name.toLowerCase().indexOf(lowerCaseFilterText) !== -1 ||
      animation.className.toLowerCase().indexOf(lowerCaseFilterText) !== -1
    );
  }

  function findAnimation(searchText) {
    const value = searchText.toLowerCase();
    const index = animations.findIndex(animation => {
      return (
        animation.name.toLowerCase() === value ||
        animation.className.toLowerCase() === value
      );
    });
    if (index !== -1) return animations[index];
    else return null;
  }

  function findAnimationName(searchText) {
    const animation = findAnimation(searchText);
    if (animation) return animation.name;
    else return '';
  }

  const items = animations.map(animation => {
    return {
      name: animation.name,
      props: {
        className: 'entry ' + animation.className,
        style: {
          color: animation.textColor,
          backgroundColor: animation.colorString,
          borderColor: animation.textColor
        }
      },
      object: animation
    };
  });

  return (
    <CustomSelect
      value={props.value}
      items={items}
      handleSelect={handleSelect}
      filter={filter}
      findItem={findAnimation}
      findItemName={findAnimationName}
    />
  );
}

export default AnimationSelect;

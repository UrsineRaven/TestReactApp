import { useEffect, useRef } from 'react';

/**
 * Hook that sets up, maintains, and cleans up an interval.   \
 * Source: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 * @param {Function} callback - The function to call after delay
 * @param {number} delay - The delay of the interval in milliseconds. Passing null pauses it.
 */
function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default useInterval;

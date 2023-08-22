import { useEffect, useRef } from 'react';

// creating the custom useInterval hook
export default function useInterval(callback, delay) {
  const savedCallback = useRef();

  // To remember the latest callback .
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // combining the setInterval and clearInterval methods based on delay.
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    function func() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(func, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

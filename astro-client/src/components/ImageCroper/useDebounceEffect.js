import { useEffect } from 'react';

export const useDebounceEffect = (fn, waitTime, deps) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fn();
    }, waitTime);

    return () => {
      clearTimeout(timeoutId);
    };
  }, deps);
};


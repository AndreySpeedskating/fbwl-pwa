import React from 'react';

const DEFAULT_DELAY = 100;

const useDebounceCallback = (
  delay = DEFAULT_DELAY,
  cleaning = true
): ((callback: (e?: any) => void) => void) => {
  const ref = React.useRef<any>();
  React.useEffect(() => {
    if (cleaning) {
      return () => {
        if (ref.current) {
          clearTimeout(ref.current);
        }
      };
    }
  }, []);

  return (callback: any) => {
    if (ref.current) {
      clearTimeout(ref.current);
    }
    ref.current = setTimeout(() => {
      callback();
    }, delay);
  };
};

export default useDebounceCallback;

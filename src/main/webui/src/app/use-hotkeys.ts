import { useEffect, useLayoutEffect, useRef } from 'react';

export const useHotkeys = (key: string, callback: (event: KeyboardEvent) => void) => {
  const callbackRef = useRef(callback);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === key.toLowerCase()) {
        callbackRef.current(event);
      }
    };

    document.addEventListener('keydown', handler);

    return () => document.removeEventListener('keydown', handler);
  }, [key]);
};

import { useRef, useCallback } from 'react';

export default function useThrottle<T>(callback: (val: T) => void, delay: number) {
  const lastUpdateRef = useRef(0);

  const throttler = useCallback((val: T) => {
    const now = performance.now();
    if (now - lastUpdateRef.current > delay) {
      callback(val);
      lastUpdateRef.current = now;
    }
  }, [callback, delay]);

  return throttler;
}

import { useEffect, useRef } from "react";

// This hook uses a ref so that the value of the hook will persist on re-renders
// This allows us to access previous values if we need to look at them for some reason.
export default function usePrevious<T>(value: T): T | undefined {
  // ref persists accross re-renders and doesn't trigger re-renders
  const ref = useRef<T | undefined>(undefined); 

  useEffect(() => {
    // Updates ref *after* render — so on the next render, ref holds the previous value.
    ref.current = value;
  }, [value]);

  return ref.current; // returns the value of the previous render
}

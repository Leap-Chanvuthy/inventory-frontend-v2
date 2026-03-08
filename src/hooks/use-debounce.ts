/**
 * useDebounce
 *
 * Returns a debounced copy of `value` that only updates after `delay` ms
 * of inactivity. Ideal for search inputs — prevents an API request on
 * every keystroke.
 *
 * @param value  The raw value to debounce (string, number, etc.)
 * @param delay  Milliseconds to wait (default: 400)
 *
 * Usage:
 *   const debouncedSearch = useDebounce(inputValue, 400);
 *   // Pass debouncedSearch to API params — safe, no request spam
 */
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    // Clean up: cancels the pending update if value changes before delay expires
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

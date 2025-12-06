/**
 * useAutoSave Hook
 * Auto-saves form data after debounce delay
 */

import { useEffect, useRef } from 'react';

export function useAutoSave<T>(
  isDirty: boolean,
  data: T,
  onSave: (data: T) => Promise<void>,
  delayMs: number = 2000
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);
  const onSaveRef = useRef(onSave);
  const dataRef = useRef(data);
  const prevDataRef = useRef(data);

  // Update refs on every render
  useEffect(() => {
    onSaveRef.current = onSave;
    dataRef.current = data;
  });

  useEffect(() => {
    // Skip first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevDataRef.current = data;
      return;
    }

    // Only save if data has changed
    if (!isDirty) return;

    // Check if data actually changed (deep comparison for objects)
    const hasChanged = JSON.stringify(prevDataRef.current) !== JSON.stringify(data);
    if (!hasChanged) return;

    prevDataRef.current = data;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    console.log('Auto-save scheduled in', delayMs, 'ms');

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      try {
        console.log('Auto-saving...');
        await onSaveRef.current(dataRef.current);
        console.log('✓ Auto-save successful');
      } catch (error) {
        console.error('✗ Auto-save failed:', error);
      }
    }, delayMs);

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isDirty, data, delayMs]);
}

import { useState, useEffect, useRef, useCallback } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../firebase';

// Stores data as JSON strings in Firebase to guarantee correct round-trips
// for all types (including nested arrays) without any Firebase conversion issues.
export function useFirebaseSync<T>(path: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const latestRef = useRef<T>(initialValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seededRef = useRef(false);

  useEffect(() => {
    const dbRef = ref(db, path);
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = JSON.parse(snapshot.val() as string) as T;
        latestRef.current = data;
        setValue(data);
      } else if (!seededRef.current) {
        seededRef.current = true;
        set(dbRef, JSON.stringify(initialValue));
      }
    });

    return () => {
      unsubscribe();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [path]);

  const update = useCallback((newValue: T | ((prev: T) => T)) => {
    const resolved = newValue instanceof Function ? newValue(latestRef.current) : newValue;
    latestRef.current = resolved;
    setValue(resolved);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      set(ref(db, path), JSON.stringify(resolved));
    }, 600);
  }, [path]);

  const flush = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    set(ref(db, path), JSON.stringify(latestRef.current));
  }, [path]);

  return [value, update, flush] as const;
}

"use client";
import { useEffect, useState } from "react";

const useLocalStorage = <T>(keyName: string, defaultValue: T) => {
  const [storedValue, setStoredValue] = useState(defaultValue);

  const setValue = (newValue: T) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) {}
    setStoredValue(newValue);
  };

  useEffect(() => {
    try {
      const value = window.localStorage.getItem(keyName);

      if (value) {
        setStoredValue(JSON.parse(value) as T);
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
        setStoredValue(defaultValue);
      }
    } catch (err) {
      setStoredValue(defaultValue);
    }
  }, [keyName]);

  return [storedValue, setValue] as [typeof storedValue, typeof setValue];
};

export { useLocalStorage };

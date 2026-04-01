import React, { createContext, useContext, useState, useCallback } from 'react';

const UIContext = createContext(null); // Toast state holder

export function UIProvider({ children }) {
  const [toast, setToast] = useState(null); // Current toast message

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <UIContext.Provider value={{ toast, showToast }}>
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);

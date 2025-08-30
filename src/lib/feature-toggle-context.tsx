"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

export const FeatureToggleContext = createContext({
  toggles: { agentic: true, templates: true },
  setToggle: (key: 'agentic' | 'templates', value: boolean) => {},
});

export const FeatureToggleProvider = ({ children }: { children: React.ReactNode }) => {
  const [toggles, setToggles] = useState({ agentic: false, templates: false });

  useEffect(() => {
    const stored = localStorage.getItem('feature-toggles');
    if (stored) setToggles(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('feature-toggles', JSON.stringify(toggles));
  }, [toggles]);

  const setToggle = (key: 'agentic' | 'templates', value: boolean) => {
    setToggles(prev => ({ ...prev, [key]: value }));
  };

  return (
    <FeatureToggleContext.Provider value={{ toggles, setToggle }}>
      {children}
    </FeatureToggleContext.Provider>
  );
};

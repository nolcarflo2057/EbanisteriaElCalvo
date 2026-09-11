"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface StoreConfig {
  name: string;
  logoUrl?: string;
  logoDarkUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

interface StoreConfigContextType {
  config: StoreConfig | null;
  setConfig: (config: StoreConfig) => void;
}

const StoreConfigContext = createContext<StoreConfigContextType | undefined>(undefined);

export function StoreConfigProvider({ children, initialConfig }: { children: ReactNode; initialConfig?: StoreConfig }) {
  const [config, setConfig] = useState<StoreConfig | null>(initialConfig ?? null);

  return (
    <StoreConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </StoreConfigContext.Provider>
  );
}

export function useStoreConfig() {
  const context = useContext(StoreConfigContext);
  if (!context) {
    throw new Error("useStoreConfig must be used within a StoreConfigProvider");
  }
  return context;
}


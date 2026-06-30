"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { SiteSettingsPayload } from "@/lib/content";

type PortfolioSettingsContextValue = {
  settings: SiteSettingsPayload | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const PortfolioSettingsContext = createContext<PortfolioSettingsContextValue | null>(null);

export function PortfolioSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettingsPayload | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) setSettings(await res.json());
    } catch {
      setSettings(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <PortfolioSettingsContext.Provider value={{ settings, loading, refresh }}>
      {children}
    </PortfolioSettingsContext.Provider>
  );
}

export function usePortfolioSettings() {
  const ctx = useContext(PortfolioSettingsContext);
  if (!ctx) {
    throw new Error("usePortfolioSettings must be used within PortfolioSettingsProvider");
  }
  return ctx;
}
"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { ParsedGithubRepo, AppState } from "@/types";

interface AppStateContextValue extends AppState {
  setRepo: (repo: ParsedGithubRepo) => void;
  reset: () => void;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [parsedRepo, setParsedRepo] = useState<ParsedGithubRepo | null>(null);

  const setRepo = useCallback((repo: ParsedGithubRepo) => {
    setParsedRepo(repo);
  }, []);

  const reset = useCallback(() => {
    setParsedRepo(null);
  }, []);

  return (
    <AppStateContext.Provider value={{ parsedRepo, setRepo, reset }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}

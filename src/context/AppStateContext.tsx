"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { ParsedGithubRepo, GithubAnalysisResult, RawEvidence } from "@/types";
import { normalizeGithubDataToEvidence } from "@/lib/evidence-normalizer";
import { DEFAULT_ROLE_ID } from "@/lib/skill-taxonomy";

interface AppStateContextValue {
  parsedRepo: ParsedGithubRepo | null;
  analysis: GithubAnalysisResult | null;
  rawEvidence: RawEvidence[];
  selectedRoleId: string;
  loadedAt: string | null;
  setRepo: (repo: ParsedGithubRepo) => void;
  setAnalysis: (result: GithubAnalysisResult) => void;
  reset: () => void;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [parsedRepo, setParsedRepo] = useState<ParsedGithubRepo | null>(null);
  const [analysis, setAnalysisState] = useState<GithubAnalysisResult | null>(null);
  const [rawEvidence, setRawEvidence] = useState<RawEvidence[]>([]);
  const [selectedRoleId] = useState<string>(DEFAULT_ROLE_ID);
  const [loadedAt, setLoadedAt] = useState<string | null>(null);

  const setRepo = useCallback((repo: ParsedGithubRepo) => {
    setParsedRepo(repo);
  }, []);

  const setAnalysis = useCallback((result: GithubAnalysisResult) => {
    setAnalysisState(result);
    setRawEvidence(normalizeGithubDataToEvidence(result));
    setLoadedAt(new Date().toISOString());
  }, []);

  const reset = useCallback(() => {
    setParsedRepo(null);
    setAnalysisState(null);
    setRawEvidence([]);
    setLoadedAt(null);
  }, []);

  return (
    <AppStateContext.Provider
      value={{ parsedRepo, analysis, rawEvidence, selectedRoleId, loadedAt, setRepo, setAnalysis, reset }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}

"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type {
  ParsedGithubRepo,
  GithubAnalysisResult,
  RawEvidence,
  SkillSignal,
  ContributorSkillProfile,
  ContributorGapProfile,
} from "@/types";
import { normalizeGithubDataToEvidence } from "@/lib/evidence-normalizer";
import { generateSkillSignals, aggregateSkillScores } from "@/lib/scoring-engine";
import { detectSkillGaps } from "@/lib/gap-engine";
import { DEFAULT_ROLE_ID, SKILL_DEFINITIONS, getRoleById } from "@/lib/skill-taxonomy";

interface AppStateContextValue {
  parsedRepo: ParsedGithubRepo | null;
  analysis: GithubAnalysisResult | null;
  rawEvidence: RawEvidence[];
  skillSignals: SkillSignal[];
  contributorProfiles: ContributorSkillProfile[];
  contributorGapProfiles: ContributorGapProfile[];
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
  const [skillSignals, setSkillSignals] = useState<SkillSignal[]>([]);
  const [contributorProfiles, setContributorProfiles] = useState<ContributorSkillProfile[]>([]);
  const [contributorGapProfiles, setContributorGapProfiles] = useState<ContributorGapProfile[]>([]);
  const [selectedRoleId] = useState<string>(DEFAULT_ROLE_ID);
  const [loadedAt, setLoadedAt] = useState<string | null>(null);

  const setRepo = useCallback((repo: ParsedGithubRepo) => {
    setParsedRepo(repo);
  }, []);

  const setAnalysis = useCallback((result: GithubAnalysisResult) => {
    setAnalysisState(result);
    const evidence = normalizeGithubDataToEvidence(result);
    setRawEvidence(evidence);
    const signals = generateSkillSignals(evidence);
    setSkillSignals(signals);
    const profiles = aggregateSkillScores(signals, SKILL_DEFINITIONS);
    setContributorProfiles(profiles);
    const role = getRoleById(DEFAULT_ROLE_ID);
    if (role) {
      setContributorGapProfiles(detectSkillGaps(profiles, role));
    }
    setLoadedAt(new Date().toISOString());
  }, []);

  const reset = useCallback(() => {
    setParsedRepo(null);
    setAnalysisState(null);
    setRawEvidence([]);
    setSkillSignals([]);
    setContributorProfiles([]);
    setContributorGapProfiles([]);
    setLoadedAt(null);
  }, []);

  return (
    <AppStateContext.Provider
      value={{
        parsedRepo, analysis, rawEvidence, skillSignals, contributorProfiles,
        contributorGapProfiles, selectedRoleId, loadedAt, setRepo, setAnalysis, reset,
      }}
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

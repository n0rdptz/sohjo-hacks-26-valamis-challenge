import type { SkillScore, ContributorSkillProfile, SkillDefinition } from "@/types";
import { getSkillById, SKILL_DEFINITIONS } from "./skill-taxonomy";

export type ScoreStatus = "strong" | "moderate" | "weak";
export type ConfidenceStatus = "high" | "medium" | "low";

export function formatScore(score: number): string {
  return `${Math.round(score * 100)}%`;
}

export function getScoreStatus(score: number): ScoreStatus {
  if (score >= 0.8) return "strong";
  if (score >= 0.55) return "moderate";
  return "weak";
}

export function getConfidenceStatus(confidence: number): ConfidenceStatus {
  if (confidence >= 0.75) return "high";
  if (confidence >= 0.5) return "medium";
  return "low";
}

export function scoreStatusColor(status: ScoreStatus): "success" | "warning" | "default" {
  if (status === "strong") return "success";
  if (status === "moderate") return "warning";
  return "default";
}

export function confidenceStatusColor(status: ConfidenceStatus): "success" | "warning" | "default" {
  if (status === "high") return "success";
  if (status === "medium") return "warning";
  return "default";
}

export function getContributorTopSkill(
  profile: ContributorSkillProfile,
): { label: string; score: number } | null {
  const scored = profile.skillScores.filter((s) => s.signalCount > 0);
  if (scored.length === 0) return null;
  const top = scored.reduce((a, b) => (b.normalizedScore > a.normalizedScore ? b : a));
  const def = getSkillById(top.skillId);
  return { label: def?.label ?? top.skillId, score: top.normalizedScore };
}

export function getContributorLowestSkill(
  profile: ContributorSkillProfile,
): { label: string; score: number } | null {
  const scored = profile.skillScores.filter((s) => s.signalCount > 0);
  if (scored.length === 0) return null;
  const lowest = scored.reduce((a, b) => (b.normalizedScore < a.normalizedScore ? b : a));
  const def = getSkillById(lowest.skillId);
  return { label: def?.label ?? lowest.skillId, score: lowest.normalizedScore };
}

export function getContributorAvgScore(profile: ContributorSkillProfile): number {
  const scored = profile.skillScores.filter((s) => s.signalCount > 0);
  if (scored.length === 0) return 0;
  return scored.reduce((sum, s) => sum + s.normalizedScore, 0) / scored.length;
}

export function sortSkillScores(scores: SkillScore[]): SkillScore[] {
  const defMap = new Map<string, SkillDefinition>();
  for (const d of SKILL_DEFINITIONS) defMap.set(d.id, d);

  return [...scores].sort((a, b) => {
    const da = defMap.get(a.skillId);
    const db = defMap.get(b.skillId);
    const pa = da?.priority === "core" ? 0 : 1;
    const pb = db?.priority === "core" ? 0 : 1;
    if (pa !== pb) return pa - pb;
    return b.normalizedScore - a.normalizedScore;
  });
}

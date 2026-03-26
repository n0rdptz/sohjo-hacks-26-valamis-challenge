import type { SkillScore, SkillSignal, RawEvidenceType } from "@/types";

const TYPE_LABELS: Record<RawEvidenceType, string> = {
  commit_authored: "code contributions",
  pr_opened: "pull requests",
  file_touched: "repository files",
  testing_file_detected: "testing-related files",
  typescript_usage_detected: "TypeScript files",
  react_hooks_detected: "React hooks usage",
  state_management_detected: "state management patterns",
  async_code_detected: "async code patterns",
};

export function buildSkillScoreExplanation(score: SkillScore, signals: SkillSignal[]): string {
  if (signals.length === 0) {
    return "No direct evidence detected for this skill.";
  }

  const typeCounts = new Map<RawEvidenceType, number>();
  for (const s of signals) {
    typeCounts.set(s.sourceEvidenceType, (typeCounts.get(s.sourceEvidenceType) ?? 0) + 1);
  }

  const sorted = Array.from(typeCounts.entries()).sort((a, b) => b[1] - a[1]);
  const topTypes = sorted.slice(0, 2).map(([t]) => TYPE_LABELS[t]);

  const confLabel = score.confidence >= 0.75 ? "high" : score.confidence >= 0.5 ? "moderate" : "low";

  if (topTypes.length === 1) {
    return `Mainly driven by ${topTypes[0]} (${confLabel} confidence, ${signals.length} signals).`;
  }
  return `Driven by ${topTypes.join(" and ")} (${confLabel} confidence, ${signals.length} signals).`;
}

export function buildConfidenceExplanation(confidence: number, signalCount: number): string {
  if (signalCount === 0) return "No signals — confidence is zero.";
  const pct = Math.round(confidence * 100);
  if (confidence >= 0.75) return `High confidence (${pct}%) based on ${signalCount} signals.`;
  if (confidence >= 0.5) return `Moderate confidence (${pct}%) based on ${signalCount} signals.`;
  return `Low confidence (${pct}%) — only ${signalCount} signal${signalCount > 1 ? "s" : ""} detected.`;
}

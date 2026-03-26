import type {
  ContributorSkillProfile,
  RoleDefinition,
  ImportanceLevel,
  GapSeverity,
  GapPriority,
  SkillGap,
  ContributorGapProfile,
} from "@/types";
import { getSkillById } from "./skill-taxonomy";

function getGapSeverity(actual: number, minimum: number, target: number): GapSeverity {
  if (actual >= target) return "none";
  const gap = target - actual;
  if (actual >= minimum && gap < 0.15) return "low";
  if (actual >= minimum && gap < 0.3) return "medium";
  return "high";
}

const PRIORITY_MATRIX: Record<GapSeverity, Record<ImportanceLevel, GapPriority>> = {
  none: { high: "low", medium: "low", low: "low" },
  low: { high: "medium", medium: "low", low: "low" },
  medium: { high: "high", medium: "medium", low: "low" },
  high: { high: "critical", medium: "high", low: "medium" },
};

function getGapPriority(severity: GapSeverity, importance: ImportanceLevel): GapPriority {
  return PRIORITY_MATRIX[severity][importance];
}

const PRIORITY_ORDER: Record<GapPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function generateExplanation(
  severity: GapSeverity,
  belowMinimum: boolean,
  signalCount: number,
  confidence: number,
  importance: ImportanceLevel,
  skillLabel: string,
): string {
  if (severity === "none") return "Meets or exceeds the target.";
  if (belowMinimum && signalCount === 0) return "No evidence found for this required skill.";
  if (belowMinimum) return `Below minimum expected level for ${skillLabel}.`;
  if (severity === "low") return "Close to target but still below threshold.";
  if (severity === "medium") return "Notable gap — actual score is below the target.";
  if (confidence < 0.5) return "Significant gap, though based on limited evidence.";
  return `Significant gap for a ${importance}-importance skill.`;
}

export function detectSkillGaps(
  profiles: ContributorSkillProfile[],
  role: RoleDefinition,
): ContributorGapProfile[] {
  return profiles.map((profile) => {
    const gaps: SkillGap[] = role.requiredSkills.map((req) => {
      const score = profile.skillScores.find((s) => s.skillId === req.skillId);
      const actual = score?.normalizedScore ?? 0;
      const confidence = score?.confidence ?? 0;
      const signalCount = score?.signalCount ?? 0;

      const gapAmount = Math.max(0, req.targetScore - actual);
      const belowMinimum = actual < req.minimumScore;
      const severity = getGapSeverity(actual, req.minimumScore, req.targetScore);
      const priority = getGapPriority(severity, req.importance);
      const skillDef = getSkillById(req.skillId);
      const explanation = generateExplanation(
        severity, belowMinimum, signalCount, confidence, req.importance,
        skillDef?.label ?? req.skillId,
      );

      return {
        contributorLogin: profile.contributorLogin,
        skillId: req.skillId,
        actualScore: actual,
        targetScore: req.targetScore,
        minimumScore: req.minimumScore,
        gapAmount,
        belowMinimum,
        severity,
        priority,
        confidence,
        signalCount,
        explanation,
      };
    });

    gaps.sort((a, b) => {
      const po = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (po !== 0) return po;
      return b.gapAmount - a.gapAmount;
    });

    const topGap = gaps.find((g) => g.severity !== "none") ?? null;
    const totalGapCount = gaps.filter((g) => g.severity !== "none").length;
    const highPriorityGapCount = gaps.filter(
      (g) => g.priority === "high" || g.priority === "critical",
    ).length;

    return {
      contributorLogin: profile.contributorLogin,
      gaps,
      topGap,
      totalGapCount,
      highPriorityGapCount,
    };
  });
}

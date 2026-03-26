import type { ContributorGapProfile, SkillGap, GapPriority } from "@/types";
import { getSkillById } from "./skill-taxonomy";

const PRIORITY_ORDER: Record<GapPriority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export function getTopRiskGaps(profiles: ContributorGapProfile[], limit = 5): SkillGap[] {
  const allGaps: SkillGap[] = [];
  for (const p of profiles) {
    for (const g of p.gaps) {
      if (g.severity !== "none") allGaps.push(g);
    }
  }

  allGaps.sort((a, b) => {
    const po = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (po !== 0) return po;
    const ga = b.gapAmount - a.gapAmount;
    if (ga !== 0) return ga;
    return b.confidence - a.confidence;
  });

  return allGaps.slice(0, limit);
}

export function countContributorsWithCriticalGaps(profiles: ContributorGapProfile[]): number {
  return profiles.filter((p) => p.highPriorityGapCount > 0).length;
}

export function buildContributorSummary(profile: ContributorGapProfile): string {
  const significantGaps = profile.gaps.filter((g) => g.severity !== "none");
  if (significantGaps.length === 0) return "No significant gaps detected.";

  const topLabels = significantGaps
    .slice(0, 2)
    .map((g) => getSkillById(g.skillId)?.label ?? g.skillId);

  if (topLabels.length === 1) {
    return `Most significant gap in ${topLabels[0]}.`;
  }
  return `Most significant gaps in ${topLabels.join(" and ")}.`;
}

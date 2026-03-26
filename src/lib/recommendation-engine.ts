import type {
  SkillGap,
  LearningContentItem,
  LearningFormat,
  SkillRecommendation,
  ContributorGapProfile,
  ContributorRecommendationProfile,
} from "@/types";
import { getSkillById } from "./skill-taxonomy";
import { getCatalogForSkill } from "./learning-catalog";

const MAX_ITEMS = 3;

// Preferred formats by severity
const FORMAT_PRIORITY: Record<string, LearningFormat[]> = {
  high_belowMin_noEvidence: ["course", "practice", "guide"],
  high_belowMin: ["course", "guide", "practice"],
  high: ["guide", "practice", "course"],
  medium: ["guide", "practice", "course"],
  low: ["checklist", "guide"],
};

function selectLearningItems(gap: SkillGap): LearningContentItem[] {
  if (gap.severity === "none") return [];

  const candidates = getCatalogForSkill(gap.skillId);
  if (candidates.length === 0) return [];

  let key: string;
  let limit: number;

  if (gap.severity === "high" && gap.belowMinimum && gap.signalCount === 0) {
    key = "high_belowMin_noEvidence";
    limit = 3;
  } else if (gap.severity === "high" && gap.belowMinimum) {
    key = "high_belowMin";
    limit = 3;
  } else if (gap.severity === "high") {
    key = "high";
    limit = 2;
  } else if (gap.severity === "medium") {
    key = "medium";
    limit = 2;
  } else {
    key = "low";
    limit = 1;
  }

  const preferredFormats = FORMAT_PRIORITY[key];
  const selected: LearningContentItem[] = [];
  const usedIds = new Set<string>();

  // Pick items in order of preferred formats
  for (const format of preferredFormats) {
    if (selected.length >= limit) break;
    const match = candidates.find((c) => c.format === format && !usedIds.has(c.id));
    if (match) {
      selected.push(match);
      usedIds.add(match.id);
    }
  }

  // Fill remaining slots if needed
  if (selected.length < limit) {
    for (const c of candidates) {
      if (selected.length >= limit) break;
      if (!usedIds.has(c.id)) {
        selected.push(c);
        usedIds.add(c.id);
      }
    }
  }

  return selected.slice(0, MAX_ITEMS);
}

function buildReason(gap: SkillGap): string {
  const label = getSkillById(gap.skillId)?.label ?? gap.skillId;

  if (gap.belowMinimum && gap.signalCount === 0) {
    return `No evidence found — foundational learning recommended for ${label}.`;
  }
  if (gap.belowMinimum) {
    return `Below minimum level — strengthening fundamentals in ${label} is recommended.`;
  }
  if (gap.severity === "high") {
    return `Significant gap in ${label} — focused practice recommended.`;
  }
  if (gap.severity === "medium") {
    return `Moderate gap in ${label} — targeted learning suggested.`;
  }
  return `Close to target — a quick review of ${label} can help close this gap.`;
}

export function generateRecommendations(
  gapProfiles: ContributorGapProfile[],
  _catalog: LearningContentItem[],
): ContributorRecommendationProfile[] {
  return gapProfiles.map((profile) => {
    const recommendations: SkillRecommendation[] = [];

    for (const gap of profile.gaps) {
      if (gap.severity === "none") continue;

      const items = selectLearningItems(gap);
      recommendations.push({
        contributorLogin: profile.contributorLogin,
        skillId: gap.skillId,
        gapSeverity: gap.severity,
        gapPriority: gap.priority,
        recommendedItems: items,
        reason: buildReason(gap),
      });
    }

    return {
      contributorLogin: profile.contributorLogin,
      recommendations,
      topRecommendation: recommendations.length > 0 ? recommendations[0] : null,
    };
  });
}

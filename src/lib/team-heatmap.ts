import type {
  ContributorSkillProfile,
  ContributorGapProfile,
  ContributorRecommendationProfile,
  RoleDefinition,
  GapSeverity,
  GapPriority,
} from "@/types";

export interface TeamHeatmapCell {
  contributorLogin: string;
  skillId: string;
  score: number;
  confidence: number;
  targetScore: number;
  minimumScore: number;
  severity: GapSeverity;
  priority: GapPriority;
  signalCount: number;
  recommendationTitle?: string;
}

export interface TeamSkillSummary {
  skillId: string;
  averageScore: number;
  averageConfidence: number;
  contributorsWithGapCount: number;
  highPriorityGapCount: number;
}

export interface TeamContributorSummary {
  contributorLogin: string;
  averageScore: number;
  totalGapCount: number;
  highPriorityGapCount: number;
}

export function buildTeamHeatmapCells(
  profiles: ContributorSkillProfile[],
  gapProfiles: ContributorGapProfile[],
  recProfiles: ContributorRecommendationProfile[],
  role: RoleDefinition,
): TeamHeatmapCell[] {
  const gapMap = new Map<string, Map<string, ContributorGapProfile["gaps"][number]>>();
  for (const gp of gapProfiles) {
    const inner = new Map<string, ContributorGapProfile["gaps"][number]>();
    for (const g of gp.gaps) inner.set(g.skillId, g);
    gapMap.set(gp.contributorLogin, inner);
  }

  const recMap = new Map<string, Map<string, string>>();
  for (const rp of recProfiles) {
    const inner = new Map<string, string>();
    for (const r of rp.recommendations) {
      if (r.recommendedItems.length > 0) {
        inner.set(r.skillId, r.recommendedItems[0].title);
      }
    }
    recMap.set(rp.contributorLogin, inner);
  }

  const cells: TeamHeatmapCell[] = [];

  for (const profile of profiles) {
    const login = profile.contributorLogin;
    for (const req of role.requiredSkills) {
      const score = profile.skillScores.find((s) => s.skillId === req.skillId);
      const gap = gapMap.get(login)?.get(req.skillId);

      cells.push({
        contributorLogin: login,
        skillId: req.skillId,
        score: score?.normalizedScore ?? 0,
        confidence: score?.confidence ?? 0,
        targetScore: req.targetScore,
        minimumScore: req.minimumScore,
        severity: gap?.severity ?? "none",
        priority: gap?.priority ?? "low",
        signalCount: score?.signalCount ?? 0,
        recommendationTitle: recMap.get(login)?.get(req.skillId),
      });
    }
  }

  return cells;
}

export function buildTeamSkillSummaries(
  cells: TeamHeatmapCell[],
  role: RoleDefinition,
): TeamSkillSummary[] {
  const grouped = new Map<string, TeamHeatmapCell[]>();
  for (const c of cells) {
    const arr = grouped.get(c.skillId);
    if (arr) arr.push(c);
    else grouped.set(c.skillId, [c]);
  }

  return role.requiredSkills.map((req) => {
    const group = grouped.get(req.skillId) ?? [];
    const n = group.length || 1;
    return {
      skillId: req.skillId,
      averageScore: group.reduce((s, c) => s + c.score, 0) / n,
      averageConfidence: group.reduce((s, c) => s + c.confidence, 0) / n,
      contributorsWithGapCount: group.filter((c) => c.severity !== "none").length,
      highPriorityGapCount: group.filter(
        (c) => c.priority === "high" || c.priority === "critical",
      ).length,
    };
  });
}

export function buildTeamContributorSummaries(
  gapProfiles: ContributorGapProfile[],
  profiles: ContributorSkillProfile[],
): TeamContributorSummary[] {
  return gapProfiles
    .map((gp) => {
      const sp = profiles.find((p) => p.contributorLogin === gp.contributorLogin);
      const scored = sp?.skillScores.filter((s) => s.signalCount > 0) ?? [];
      const avg = scored.length > 0
        ? scored.reduce((s, sc) => s + sc.normalizedScore, 0) / scored.length
        : 0;

      return {
        contributorLogin: gp.contributorLogin,
        averageScore: avg,
        totalGapCount: gp.totalGapCount,
        highPriorityGapCount: gp.highPriorityGapCount,
      };
    })
    .sort((a, b) => {
      const hp = b.highPriorityGapCount - a.highPriorityGapCount;
      if (hp !== 0) return hp;
      return b.totalGapCount - a.totalGapCount;
    });
}

export function getHeatmapCellColor(cell: TeamHeatmapCell): string {
  const alpha = cell.confidence < 0.35 ? "80" : "";
  if (cell.score >= cell.targetScore) return `#c8e6c9${alpha}`;
  if (cell.score >= cell.minimumScore) return `#fff9c4${alpha}`;
  if (cell.score > 0) return `#ffcdd2${alpha}`;
  return `#f5f5f5${alpha}`;
}

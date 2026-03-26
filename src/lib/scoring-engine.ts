import type {
  RawEvidence,
  RawEvidenceType,
  SkillSignal,
  SkillScore,
  SkillDefinition,
  ContributorSkillProfile,
} from "@/types";
import { EVIDENCE_SKILL_MAPPINGS } from "./skill-taxonomy";

// --- Base scoring parameters per evidence type ---

const BASE_PARAMS: Record<RawEvidenceType, { baseScore: number; confidence: number; weight: number }> = {
  commit_authored:           { baseScore: 0.35, confidence: 0.45, weight: 0.5 },
  pr_opened:                 { baseScore: 0.4,  confidence: 0.5,  weight: 0.6 },
  file_touched:              { baseScore: 0.3,  confidence: 0.35, weight: 0.4 },
  testing_file_detected:     { baseScore: 0.75, confidence: 0.8,  weight: 0.9 },
  typescript_usage_detected: { baseScore: 0.8,  confidence: 0.85, weight: 0.95 },
  react_hooks_detected:      { baseScore: 0.78, confidence: 0.8,  weight: 0.9 },
  state_management_detected: { baseScore: 0.72, confidence: 0.78, weight: 0.85 },
  async_code_detected:       { baseScore: 0.7,  confidence: 0.75, weight: 0.85 },
};

// --- Per-skill multipliers for cross-mapped signals ---

const SKILL_MULTIPLIERS: Partial<Record<RawEvidenceType, Record<string, number>>> = {
  react_hooks_detected: {
    react_fundamentals: 1.0,
    component_architecture: 0.7,
  },
  async_code_detected: {
    async_data_fetching: 1.0,
    performance_awareness: 0.7,
  },
};

function getMultiplier(evidenceType: RawEvidenceType, skillId: string): number {
  return SKILL_MULTIPLIERS[evidenceType]?.[skillId] ?? 1.0;
}

// --- Signal generation ---

export function generateSkillSignals(evidence: RawEvidence[]): SkillSignal[] {
  const realLogins = new Set<string>();
  for (const e of evidence) {
    if (e.contributorLogin !== "_repo") {
      realLogins.add(e.contributorLogin);
    }
  }
  const allRealLogins = Array.from(realLogins);

  const signals: SkillSignal[] = [];

  for (const e of evidence) {
    const mapping = EVIDENCE_SKILL_MAPPINGS.find((m) => m.evidenceType === e.type);
    if (!mapping || mapping.skillIds.length === 0) continue;

    const params = BASE_PARAMS[e.type];

    // Determine which contributors this evidence applies to
    const logins = e.contributorLogin === "_repo" ? allRealLogins : [e.contributorLogin];

    for (const login of logins) {
      for (const skillId of mapping.skillIds) {
        const multiplier = getMultiplier(e.type, skillId);
        signals.push({
          id: `signal::${login}::${skillId}::${e.id}`,
          contributorLogin: login,
          skillId,
          sourceEvidenceId: e.id,
          sourceEvidenceType: e.type,
          score: params.baseScore * multiplier,
          confidence: params.confidence,
          weight: params.weight,
          explanation: `${e.type} → ${skillId} (score: ${(params.baseScore * multiplier).toFixed(2)})`,
        });
      }
    }
  }

  return signals;
}

// --- Aggregation ---

function generateSummary(
  normalizedScore: number,
  signalCount: number,
  dominantType: RawEvidenceType | null,
): string {
  if (signalCount === 0) return "No evidence found for this skill.";

  let text: string;
  if (normalizedScore >= 0.7) {
    text = `Strong score based on ${signalCount} signal${signalCount > 1 ? "s" : ""}.`;
  } else if (normalizedScore >= 0.4) {
    text = `Moderate score based on ${signalCount} signal${signalCount > 1 ? "s" : ""}.`;
  } else {
    text = `Weak score based on limited evidence.`;
  }

  if (dominantType) {
    const label = dominantType.replace(/_/g, " ");
    text += ` Primarily from ${label}.`;
  }

  return text;
}

export function aggregateSkillScores(
  signals: SkillSignal[],
  allSkills: SkillDefinition[],
): ContributorSkillProfile[] {
  // Group by contributor + skill
  const groups = new Map<string, SkillSignal[]>();
  const contributorSet = new Set<string>();

  for (const s of signals) {
    contributorSet.add(s.contributorLogin);
    const key = `${s.contributorLogin}::${s.skillId}`;
    const arr = groups.get(key);
    if (arr) {
      arr.push(s);
    } else {
      groups.set(key, [s]);
    }
  }

  const profiles: ContributorSkillProfile[] = [];

  for (const login of Array.from(contributorSet).sort()) {
    const skillScores: SkillScore[] = [];

    for (const skill of allSkills) {
      const key = `${login}::${skill.id}`;
      const group = groups.get(key) ?? [];

      if (group.length === 0) {
        skillScores.push({
          contributorLogin: login,
          skillId: skill.id,
          rawScore: 0,
          normalizedScore: 0,
          confidence: 0,
          signalCount: 0,
          summary: "No evidence found for this skill.",
        });
        continue;
      }

      let weightedSum = 0;
      let normalizer = 0;
      let confidenceWeightedSum = 0;

      // Track dominant evidence type
      const typeCounts = new Map<RawEvidenceType, number>();

      for (const s of group) {
        const cw = s.confidence * s.weight;
        weightedSum += s.score * cw;
        normalizer += cw;
        confidenceWeightedSum += s.confidence * cw;
        typeCounts.set(s.sourceEvidenceType, (typeCounts.get(s.sourceEvidenceType) ?? 0) + 1);
      }

      const normalizedScore = normalizer > 0 ? Math.min(1, weightedSum / normalizer) : 0;
      const confidence = normalizer > 0 ? confidenceWeightedSum / normalizer : 0;

      // Find dominant type (>50% of signals)
      let dominantType: RawEvidenceType | null = null;
      for (const [type, count] of typeCounts) {
        if (count > group.length * 0.5) {
          dominantType = type;
          break;
        }
      }

      skillScores.push({
        contributorLogin: login,
        skillId: skill.id,
        rawScore: weightedSum,
        normalizedScore,
        confidence,
        signalCount: group.length,
        summary: generateSummary(normalizedScore, group.length, dominantType),
      });
    }

    profiles.push({ contributorLogin: login, skillScores });
  }

  return profiles;
}

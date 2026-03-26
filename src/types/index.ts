export interface ParsedGithubRepo {
  originalUrl: string;
  owner: string;
  repo: string;
  parsedAt: string;
}

export interface GithubRepositoryInfo {
  name: string;
  fullName: string;
  description: string | null;
  stars: number;
  forks: number;
  defaultBranch: string;
  language: string | null;
  htmlUrl: string;
}

export interface GithubContributor {
  login: string;
  avatarUrl: string;
  contributions: number;
  htmlUrl: string;
}

export interface GithubCommit {
  sha: string;
  authorLogin: string;
  message: string;
  date: string;
  htmlUrl: string;
}

export interface GithubPullRequest {
  number: number;
  title: string;
  user: string;
  state: string;
  createdAt: string;
  mergedAt: string | null;
  htmlUrl: string;
}

export interface GithubContentItem {
  name: string;
  path: string;
  type: "file" | "dir" | "symlink" | "submodule";
  size: number;
  htmlUrl: string;
  downloadUrl: string | null;
}

export interface GithubAnalysisResult {
  repositoryInfo: GithubRepositoryInfo | null;
  contributors: GithubContributor[] | null;
  commits: GithubCommit[] | null;
  pullRequests: GithubPullRequest[] | null;
  repositoryContents: GithubContentItem[] | null;
}

export interface ApiErrorResponse {
  error: string;
  status: number;
  details?: string;
}

export type RawEvidenceType =
  | "commit_authored"
  | "pr_opened"
  | "file_touched"
  | "testing_file_detected"
  | "typescript_usage_detected"
  | "react_hooks_detected"
  | "state_management_detected"
  | "async_code_detected";

export interface RawEvidence {
  id: string;
  contributorLogin: string;
  type: RawEvidenceType;
  timestamp?: string;
  metadata: Record<string, unknown>;
  source: "github";
  description: string;
}

export type SkillCategory = "frontend" | "engineering";
export type SkillPriority = "core" | "secondary";
export type ImportanceLevel = "high" | "medium" | "low";

export interface SkillDefinition {
  id: string;
  label: string;
  description: string;
  category: SkillCategory;
  priority: SkillPriority;
}

export interface RoleSkillRequirement {
  skillId: string;
  targetScore: number;
  minimumScore: number;
  importance: ImportanceLevel;
}

export interface RoleDefinition {
  id: string;
  label: string;
  description: string;
  requiredSkills: RoleSkillRequirement[];
}

export interface EvidenceSkillMapping {
  evidenceType: RawEvidenceType;
  skillIds: string[];
  rationale: string;
}

export interface SkillSignal {
  id: string;
  contributorLogin: string;
  skillId: string;
  sourceEvidenceId: string;
  sourceEvidenceType: RawEvidenceType;
  score: number;
  confidence: number;
  weight: number;
  explanation: string;
}

export interface SkillScore {
  contributorLogin: string;
  skillId: string;
  rawScore: number;
  normalizedScore: number;
  confidence: number;
  signalCount: number;
  summary: string;
}

export interface ContributorSkillProfile {
  contributorLogin: string;
  skillScores: SkillScore[];
}

export type GapSeverity = "none" | "low" | "medium" | "high";
export type GapPriority = "low" | "medium" | "high" | "critical";

export interface SkillGap {
  contributorLogin: string;
  skillId: string;
  actualScore: number;
  targetScore: number;
  minimumScore: number;
  gapAmount: number;
  belowMinimum: boolean;
  severity: GapSeverity;
  priority: GapPriority;
  confidence: number;
  signalCount: number;
  explanation: string;
}

export interface ContributorGapProfile {
  contributorLogin: string;
  gaps: SkillGap[];
  topGap: SkillGap | null;
  totalGapCount: number;
  highPriorityGapCount: number;
}

export interface AppState {
  parsedRepo: ParsedGithubRepo | null;
  analysis: GithubAnalysisResult | null;
  rawEvidence: RawEvidence[];
  skillSignals: SkillSignal[];
  contributorProfiles: ContributorSkillProfile[];
  contributorGapProfiles: ContributorGapProfile[];
  selectedRoleId: string;
  loadedAt: string | null;
}

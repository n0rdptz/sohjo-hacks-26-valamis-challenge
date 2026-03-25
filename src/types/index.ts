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

export interface AppState {
  parsedRepo: ParsedGithubRepo | null;
  analysis: GithubAnalysisResult | null;
  loadedAt: string | null;
}

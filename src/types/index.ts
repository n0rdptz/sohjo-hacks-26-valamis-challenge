export interface ParsedGithubRepo {
  originalUrl: string;
  owner: string;
  repo: string;
  parsedAt: string;
}

export interface AppState {
  parsedRepo: ParsedGithubRepo | null;
}

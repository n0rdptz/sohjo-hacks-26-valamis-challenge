const GITHUB_REPO_RE = /^https:\/\/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)\/?$/;

export function isValidGithubRepoUrl(url: string): boolean {
  return GITHUB_REPO_RE.test(url.trim());
}

export function parseGithubRepoUrl(url: string): { owner: string; repo: string } | null {
  const match = url.trim().match(GITHUB_REPO_RE);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

const GITHUB_API_BASE = "https://api.github.com";

function getHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "SkillScope/1.0",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export class GithubApiError extends Error {
  status: number;
  rateLimitRemaining: string | null;

  constructor(message: string, status: number, rateLimitRemaining: string | null) {
    super(message);
    this.name = "GithubApiError";
    this.status = status;
    this.rateLimitRemaining = rateLimitRemaining;
  }
}

export async function githubFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${GITHUB_API_BASE}${path}`, {
    headers: getHeaders(),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new GithubApiError(
      body.message || res.statusText,
      res.status,
      res.headers.get("x-ratelimit-remaining"),
    );
  }

  return res.json();
}

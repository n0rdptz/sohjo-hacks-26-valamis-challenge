import { githubFetch } from "./github-api";
import type {
  GithubAnalysisResult,
  GithubRepositoryInfo,
  GithubContributor,
  GithubCommit,
  GithubPullRequest,
  GithubContentItem,
} from "@/types";

const MAX_CONTRIBUTORS = 4;
const MAX_COMMITS_PER_CONTRIBUTOR = 20;
const MAX_PULL_REQUESTS = 10;
const MAX_ROOT_ITEMS = 50;

/* eslint-disable @typescript-eslint/no-explicit-any */

function mapRepoInfo(raw: any): GithubRepositoryInfo {
  return {
    name: raw.name,
    fullName: raw.full_name,
    description: raw.description ?? null,
    stars: raw.stargazers_count,
    forks: raw.forks_count,
    defaultBranch: raw.default_branch,
    language: raw.language ?? null,
    htmlUrl: raw.html_url,
  };
}

function mapContributor(raw: any): GithubContributor {
  return {
    login: raw.login,
    avatarUrl: raw.avatar_url,
    contributions: raw.contributions,
    htmlUrl: raw.html_url,
  };
}

function mapCommit(raw: any, authorLogin: string): GithubCommit {
  return {
    sha: raw.sha,
    authorLogin,
    message: raw.commit?.message ?? "",
    date: raw.commit?.author?.date ?? raw.commit?.committer?.date ?? "",
    htmlUrl: raw.html_url,
  };
}

function mapPullRequest(raw: any): GithubPullRequest {
  return {
    number: raw.number,
    title: raw.title,
    user: raw.user?.login ?? "unknown",
    state: raw.state,
    createdAt: raw.created_at,
    mergedAt: raw.merged_at ?? null,
    htmlUrl: raw.html_url,
  };
}

function mapContentItem(raw: any): GithubContentItem {
  return {
    name: raw.name,
    path: raw.path,
    type: raw.type,
    size: raw.size ?? 0,
    htmlUrl: raw.html_url,
    downloadUrl: raw.download_url ?? null,
  };
}

async function fetchRepoInfo(owner: string, repo: string): Promise<GithubRepositoryInfo> {
  const raw = await githubFetch<any>(`/repos/${owner}/${repo}`);
  return mapRepoInfo(raw);
}

async function fetchContributors(owner: string, repo: string): Promise<GithubContributor[]> {
  const raw = await githubFetch<any[]>(
    `/repos/${owner}/${repo}/contributors?per_page=${MAX_CONTRIBUTORS}`,
  );
  return raw.map(mapContributor);
}

async function fetchCommitsForContributors(
  owner: string,
  repo: string,
  contributors: GithubContributor[],
): Promise<GithubCommit[]> {
  const results = await Promise.allSettled(
    contributors.map(async (c) => {
      const raw = await githubFetch<any[]>(
        `/repos/${owner}/${repo}/commits?author=${encodeURIComponent(c.login)}&per_page=${MAX_COMMITS_PER_CONTRIBUTOR}`,
      );
      return raw.map((r) => mapCommit(r, c.login));
    }),
  );

  const commits: GithubCommit[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") {
      commits.push(...r.value);
    }
  }
  return commits;
}

async function fetchPullRequests(owner: string, repo: string): Promise<GithubPullRequest[]> {
  const raw = await githubFetch<any[]>(
    `/repos/${owner}/${repo}/pulls?state=all&sort=updated&direction=desc&per_page=${MAX_PULL_REQUESTS}`,
  );
  return raw.map(mapPullRequest);
}

async function fetchContents(owner: string, repo: string): Promise<GithubContentItem[]> {
  const raw = await githubFetch<any[]>(`/repos/${owner}/${repo}/contents/`);
  return raw.slice(0, MAX_ROOT_ITEMS).map(mapContentItem);
}

export async function analyzeRepository(
  owner: string,
  repo: string,
): Promise<GithubAnalysisResult> {
  // Fetch repo info first — if this fails (404), abort entirely
  const repositoryInfo = await fetchRepoInfo(owner, repo);

  // Parallel fetch for remaining data
  const [contributorsResult, pullRequestsResult, contentsResult] = await Promise.allSettled([
    fetchContributors(owner, repo),
    fetchPullRequests(owner, repo),
    fetchContents(owner, repo),
  ]);

  const contributors =
    contributorsResult.status === "fulfilled" ? contributorsResult.value : null;

  // Fetch commits per contributor (depends on contributors)
  let commits: GithubCommit[] | null = null;
  if (contributors && contributors.length > 0) {
    try {
      commits = await fetchCommitsForContributors(owner, repo, contributors);
    } catch {
      commits = null;
    }
  }

  return {
    repositoryInfo,
    contributors,
    commits,
    pullRequests: pullRequestsResult.status === "fulfilled" ? pullRequestsResult.value : null,
    repositoryContents: contentsResult.status === "fulfilled" ? contentsResult.value : null,
  };
}

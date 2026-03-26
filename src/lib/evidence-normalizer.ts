import type {
  GithubAnalysisResult,
  GithubCommit,
  GithubPullRequest,
  GithubContentItem,
  RawEvidence,
  RawEvidenceType,
} from "@/types";

function makeId(type: string, login: string, key: string): string {
  return `${type}::${login}::${key}`;
}

function firstLine(message: string): string {
  return message.split("\n")[0].slice(0, 120);
}

function fromCommit(c: GithubCommit): RawEvidence {
  return {
    id: makeId("commit_authored", c.authorLogin, c.sha),
    contributorLogin: c.authorLogin,
    type: "commit_authored",
    timestamp: c.date || undefined,
    metadata: { message: c.message, sha: c.sha },
    source: "github",
    description: `Authored commit: ${firstLine(c.message)}`,
  };
}

function fromPullRequest(pr: GithubPullRequest): RawEvidence {
  return {
    id: makeId("pr_opened", pr.user, String(pr.number)),
    contributorLogin: pr.user,
    type: "pr_opened",
    timestamp: pr.createdAt,
    metadata: { title: pr.title, number: pr.number, state: pr.state },
    source: "github",
    description: `Opened PR: ${pr.title}`,
  };
}

function fromContentItem(item: GithubContentItem): RawEvidence {
  return {
    id: makeId("file_touched", "_repo", item.path),
    contributorLogin: "_repo",
    type: "file_touched",
    metadata: { name: item.name, path: item.path, type: item.type, size: item.size },
    source: "github",
    description: `File in repo root: ${item.name}`,
  };
}

const TESTING_RE = /(test|__tests__|\.spec\.|\.test\.)/i;
const TS_RE = /\.tsx?$/i;
const DTS_RE = /\.d\.ts$/i;

function detectFileEvidence(items: GithubContentItem[]): RawEvidence[] {
  const evidence: RawEvidence[] = [];

  for (const item of items) {
    if (TESTING_RE.test(item.name) || TESTING_RE.test(item.path)) {
      evidence.push({
        id: makeId("testing_file_detected", "_repo", item.path),
        contributorLogin: "_repo",
        type: "testing_file_detected",
        metadata: { name: item.name, path: item.path },
        source: "github",
        description: `Testing file detected: ${item.name}`,
      });
    }

    if (TS_RE.test(item.name) && !DTS_RE.test(item.name)) {
      evidence.push({
        id: makeId("typescript_usage_detected", "_repo", item.path),
        contributorLogin: "_repo",
        type: "typescript_usage_detected",
        metadata: { name: item.name, path: item.path },
        source: "github",
        description: `TypeScript file detected: ${item.name}`,
      });
    }
  }

  return evidence;
}

const HEURISTIC_RULES: { type: RawEvidenceType; pattern: RegExp; label: string }[] = [
  {
    type: "react_hooks_detected",
    pattern: /\b(useState|useEffect|useMemo|useCallback|useRef)\b/i,
    label: "React hooks usage detected",
  },
  {
    type: "state_management_detected",
    pattern: /\b(redux|zustand|recoil|createContext|useContext)\b/i,
    label: "State management pattern detected",
  },
  {
    type: "async_code_detected",
    pattern: /\b(async|await|fetch|axios|promise)\b/i,
    label: "Async code pattern detected",
  },
];

function detectCommitMessageHeuristics(commits: GithubCommit[]): RawEvidence[] {
  // Deduplicate: one evidence per type per contributor
  const seen = new Set<string>();
  const evidence: RawEvidence[] = [];

  for (const commit of commits) {
    for (const rule of HEURISTIC_RULES) {
      const key = `${rule.type}::${commit.authorLogin}`;
      if (seen.has(key)) continue;

      if (rule.pattern.test(commit.message)) {
        seen.add(key);
        evidence.push({
          id: makeId(rule.type, commit.authorLogin, "heuristic"),
          contributorLogin: commit.authorLogin,
          type: rule.type,
          timestamp: commit.date || undefined,
          metadata: { detectedIn: "commit_message", sha: commit.sha },
          source: "github",
          description: `${rule.label} in commits by ${commit.authorLogin}`,
        });
      }
    }
  }

  return evidence;
}

export function normalizeGithubDataToEvidence(input: GithubAnalysisResult): RawEvidence[] {
  const evidence: RawEvidence[] = [];

  if (input.commits) {
    for (const c of input.commits) {
      evidence.push(fromCommit(c));
    }
    evidence.push(...detectCommitMessageHeuristics(input.commits));
  }

  if (input.pullRequests) {
    for (const pr of input.pullRequests) {
      evidence.push(fromPullRequest(pr));
    }
  }

  if (input.repositoryContents) {
    for (const item of input.repositoryContents) {
      evidence.push(fromContentItem(item));
    }
    evidence.push(...detectFileEvidence(input.repositoryContents));
  }

  return evidence;
}

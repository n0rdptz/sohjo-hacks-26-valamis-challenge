import type { GithubAnalysisResult, ParsedGithubRepo } from "@/types";

export const DEMO_PARSED_REPO: ParsedGithubRepo = {
  originalUrl: "https://github.com/demo-org/react-dashboard",
  owner: "demo-org",
  repo: "react-dashboard",
  parsedAt: new Date().toISOString(),
};

export const DEMO_ANALYSIS_RESULT: GithubAnalysisResult = {
  repositoryInfo: {
    name: "react-dashboard",
    fullName: "demo-org/react-dashboard",
    description: "A modern React dashboard application with TypeScript and comprehensive testing.",
    stars: 1240,
    forks: 186,
    defaultBranch: "main",
    language: "TypeScript",
    htmlUrl: "https://github.com/demo-org/react-dashboard",
  },
  contributors: [
    { login: "alice-dev", avatarUrl: "https://api.dicebear.com/7.x/identicon/svg?seed=alice", contributions: 142, htmlUrl: "https://github.com/alice-dev" },
    { login: "bob-eng", avatarUrl: "https://api.dicebear.com/7.x/identicon/svg?seed=bob", contributions: 98, htmlUrl: "https://github.com/bob-eng" },
    { login: "carol-fe", avatarUrl: "https://api.dicebear.com/7.x/identicon/svg?seed=carol", contributions: 67, htmlUrl: "https://github.com/carol-fe" },
    { login: "dave-jr", avatarUrl: "https://api.dicebear.com/7.x/identicon/svg?seed=dave", contributions: 31, htmlUrl: "https://github.com/dave-jr" },
  ],
  commits: [
    // alice-dev — strong React/TS contributor
    { sha: "a1", authorLogin: "alice-dev", message: "feat: add useState and useEffect hooks for dashboard widgets", date: "2025-03-10T10:00:00Z", htmlUrl: "#" },
    { sha: "a2", authorLogin: "alice-dev", message: "refactor: migrate state management to useContext pattern", date: "2025-03-09T14:00:00Z", htmlUrl: "#" },
    { sha: "a3", authorLogin: "alice-dev", message: "feat: implement async data fetching with retry logic", date: "2025-03-08T09:00:00Z", htmlUrl: "#" },
    { sha: "a4", authorLogin: "alice-dev", message: "test: add unit tests for dashboard components", date: "2025-03-07T16:00:00Z", htmlUrl: "#" },
    { sha: "a5", authorLogin: "alice-dev", message: "fix: memoize expensive render with useMemo and useCallback", date: "2025-03-06T11:00:00Z", htmlUrl: "#" },
    { sha: "a6", authorLogin: "alice-dev", message: "chore: update TypeScript strict mode config", date: "2025-03-05T08:00:00Z", htmlUrl: "#" },
    // bob-eng — decent but less testing
    { sha: "b1", authorLogin: "bob-eng", message: "feat: create reusable chart component with props API", date: "2025-03-10T12:00:00Z", htmlUrl: "#" },
    { sha: "b2", authorLogin: "bob-eng", message: "feat: add async fetch for analytics data", date: "2025-03-09T10:00:00Z", htmlUrl: "#" },
    { sha: "b3", authorLogin: "bob-eng", message: "refactor: split monolith into composable components", date: "2025-03-08T15:00:00Z", htmlUrl: "#" },
    { sha: "b4", authorLogin: "bob-eng", message: "fix: resolve useState stale closure bug", date: "2025-03-07T09:00:00Z", htmlUrl: "#" },
    { sha: "b5", authorLogin: "bob-eng", message: "chore: configure Redux store for notifications", date: "2025-03-06T14:00:00Z", htmlUrl: "#" },
    // carol-fe — focus on UI, less async/testing
    { sha: "c1", authorLogin: "carol-fe", message: "feat: build accessible modal with ARIA labels", date: "2025-03-10T08:00:00Z", htmlUrl: "#" },
    { sha: "c2", authorLogin: "carol-fe", message: "feat: add useEffect for keyboard navigation support", date: "2025-03-09T11:00:00Z", htmlUrl: "#" },
    { sha: "c3", authorLogin: "carol-fe", message: "style: improve component layout and spacing", date: "2025-03-08T13:00:00Z", htmlUrl: "#" },
    { sha: "c4", authorLogin: "carol-fe", message: "feat: create form components with validation", date: "2025-03-07T10:00:00Z", htmlUrl: "#" },
    // dave-jr — junior, limited signals
    { sha: "d1", authorLogin: "dave-jr", message: "fix: correct typo in header component", date: "2025-03-10T09:00:00Z", htmlUrl: "#" },
    { sha: "d2", authorLogin: "dave-jr", message: "docs: update README with setup instructions", date: "2025-03-09T16:00:00Z", htmlUrl: "#" },
    { sha: "d3", authorLogin: "dave-jr", message: "fix: adjust padding in sidebar layout", date: "2025-03-08T11:00:00Z", htmlUrl: "#" },
  ],
  pullRequests: [
    { number: 101, title: "Add dashboard widget system", user: "alice-dev", state: "closed", createdAt: "2025-03-10T10:00:00Z", mergedAt: "2025-03-10T15:00:00Z", htmlUrl: "#" },
    { number: 102, title: "Implement chart components", user: "bob-eng", state: "closed", createdAt: "2025-03-09T10:00:00Z", mergedAt: "2025-03-09T18:00:00Z", htmlUrl: "#" },
    { number: 103, title: "Accessible modal component", user: "carol-fe", state: "closed", createdAt: "2025-03-08T08:00:00Z", mergedAt: "2025-03-08T16:00:00Z", htmlUrl: "#" },
    { number: 104, title: "Fix sidebar layout issues", user: "dave-jr", state: "open", createdAt: "2025-03-10T09:00:00Z", mergedAt: null, htmlUrl: "#" },
    { number: 105, title: "Async data fetching refactor", user: "alice-dev", state: "closed", createdAt: "2025-03-07T09:00:00Z", mergedAt: "2025-03-07T14:00:00Z", htmlUrl: "#" },
    { number: 106, title: "Redux notification store", user: "bob-eng", state: "closed", createdAt: "2025-03-06T14:00:00Z", mergedAt: "2025-03-06T17:00:00Z", htmlUrl: "#" },
    { number: 107, title: "Form validation components", user: "carol-fe", state: "closed", createdAt: "2025-03-07T10:00:00Z", mergedAt: "2025-03-07T15:00:00Z", htmlUrl: "#" },
    { number: 108, title: "Unit tests for widgets", user: "alice-dev", state: "closed", createdAt: "2025-03-05T16:00:00Z", mergedAt: "2025-03-05T20:00:00Z", htmlUrl: "#" },
  ],
  repositoryContents: [
    { name: "package.json", path: "package.json", type: "file", size: 1200, htmlUrl: "#", downloadUrl: null },
    { name: "tsconfig.json", path: "tsconfig.json", type: "file", size: 450, htmlUrl: "#", downloadUrl: null },
    { name: "src", path: "src", type: "dir", size: 0, htmlUrl: "#", downloadUrl: null },
    { name: "public", path: "public", type: "dir", size: 0, htmlUrl: "#", downloadUrl: null },
    { name: "__tests__", path: "__tests__", type: "dir", size: 0, htmlUrl: "#", downloadUrl: null },
    { name: "jest.config.ts", path: "jest.config.ts", type: "file", size: 320, htmlUrl: "#", downloadUrl: null },
    { name: "next.config.ts", path: "next.config.ts", type: "file", size: 200, htmlUrl: "#", downloadUrl: null },
    { name: "components.tsx", path: "components.tsx", type: "file", size: 3400, htmlUrl: "#", downloadUrl: null },
    { name: "hooks.ts", path: "hooks.ts", type: "file", size: 1500, htmlUrl: "#", downloadUrl: null },
    { name: "utils.ts", path: "utils.ts", type: "file", size: 800, htmlUrl: "#", downloadUrl: null },
    { name: ".eslintrc.json", path: ".eslintrc.json", type: "file", size: 150, htmlUrl: "#", downloadUrl: null },
    { name: "README.md", path: "README.md", type: "file", size: 2100, htmlUrl: "#", downloadUrl: null },
    { name: "test-utils.tsx", path: "test-utils.tsx", type: "file", size: 600, htmlUrl: "#", downloadUrl: null },
  ],
};

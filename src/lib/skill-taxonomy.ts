import type {
  SkillDefinition,
  RoleDefinition,
  EvidenceSkillMapping,
  RawEvidenceType,
} from "@/types";

export const SKILL_DEFINITIONS: SkillDefinition[] = [
  {
    id: "react_fundamentals",
    label: "React Fundamentals",
    description: "Core React concepts: components, hooks, JSX, lifecycle, rendering model.",
    category: "frontend",
    priority: "core",
  },
  {
    id: "state_management",
    label: "State Management",
    description: "Managing application state with Context, Redux, Zustand, or similar tools.",
    category: "frontend",
    priority: "core",
  },
  {
    id: "async_data_fetching",
    label: "Async & Data Fetching",
    description: "Handling asynchronous operations, API calls, data loading patterns.",
    category: "frontend",
    priority: "core",
  },
  {
    id: "testing",
    label: "Testing",
    description: "Writing and maintaining unit, integration, and end-to-end tests.",
    category: "engineering",
    priority: "core",
  },
  {
    id: "typescript",
    label: "TypeScript",
    description: "Using TypeScript for type safety, generics, and type-driven development.",
    category: "engineering",
    priority: "core",
  },
  {
    id: "component_architecture",
    label: "Component Architecture",
    description: "Designing reusable, composable, and well-structured component hierarchies.",
    category: "frontend",
    priority: "core",
  },
  {
    id: "performance_awareness",
    label: "Performance Awareness",
    description: "Optimizing rendering, bundle size, memoization, and runtime performance.",
    category: "frontend",
    priority: "secondary",
  },
  {
    id: "accessibility_awareness",
    label: "Accessibility Awareness",
    description: "Building accessible UIs with proper ARIA, keyboard navigation, and semantics.",
    category: "frontend",
    priority: "secondary",
  },
];

export const DEFAULT_ROLE_ID = "frontend_software_engineer_react";

export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    id: DEFAULT_ROLE_ID,
    label: "Frontend Software Engineer (React)",
    description:
      "A frontend engineer focused on building React-based web applications with strong fundamentals in component design, state management, and modern tooling.",
    requiredSkills: [
      { skillId: "react_fundamentals", targetScore: 0.85, minimumScore: 0.7, importance: "high" },
      { skillId: "state_management", targetScore: 0.75, minimumScore: 0.6, importance: "high" },
      { skillId: "async_data_fetching", targetScore: 0.75, minimumScore: 0.6, importance: "high" },
      { skillId: "testing", targetScore: 0.7, minimumScore: 0.5, importance: "high" },
      { skillId: "typescript", targetScore: 0.8, minimumScore: 0.6, importance: "high" },
      { skillId: "component_architecture", targetScore: 0.75, minimumScore: 0.6, importance: "high" },
      { skillId: "performance_awareness", targetScore: 0.6, minimumScore: 0.4, importance: "medium" },
      { skillId: "accessibility_awareness", targetScore: 0.55, minimumScore: 0.35, importance: "medium" },
    ],
  },
];

export const EVIDENCE_SKILL_MAPPINGS: EvidenceSkillMapping[] = [
  {
    evidenceType: "commit_authored",
    skillIds: ["component_architecture"],
    rationale: "Code contribution is a weak general engineering signal.",
  },
  {
    evidenceType: "pr_opened",
    skillIds: ["component_architecture"],
    rationale: "Opening PRs is a weak signal of engineering contribution.",
  },
  {
    evidenceType: "testing_file_detected",
    skillIds: ["testing"],
    rationale: "Presence of test files directly signals testing practice.",
  },
  {
    evidenceType: "typescript_usage_detected",
    skillIds: ["typescript"],
    rationale: "TypeScript files directly signal TypeScript adoption.",
  },
  {
    evidenceType: "react_hooks_detected",
    skillIds: ["react_fundamentals", "component_architecture"],
    rationale: "React hooks usage signals familiarity with React APIs and component patterns.",
  },
  {
    evidenceType: "state_management_detected",
    skillIds: ["state_management"],
    rationale: "State management patterns directly signal this skill.",
  },
  {
    evidenceType: "async_code_detected",
    skillIds: ["async_data_fetching", "performance_awareness"],
    rationale: "Async patterns signal data fetching skills and performance awareness.",
  },
  {
    evidenceType: "file_touched",
    skillIds: [],
    rationale: "Generic file presence — no direct skill signal.",
  },
];

export function getDefaultRole(): RoleDefinition {
  return ROLE_DEFINITIONS.find((r) => r.id === DEFAULT_ROLE_ID)!;
}

export function getSkillById(skillId: string): SkillDefinition | undefined {
  return SKILL_DEFINITIONS.find((s) => s.id === skillId);
}

export function getRoleById(roleId: string): RoleDefinition | undefined {
  return ROLE_DEFINITIONS.find((r) => r.id === roleId);
}

export function getMappingsForEvidenceType(
  evidenceType: RawEvidenceType,
): EvidenceSkillMapping | undefined {
  return EVIDENCE_SKILL_MAPPINGS.find((m) => m.evidenceType === evidenceType);
}

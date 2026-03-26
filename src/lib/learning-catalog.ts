import type { LearningContentItem } from "@/types";

export const LEARNING_CATALOG: LearningContentItem[] = [
  // --- react_fundamentals ---
  { id: "react-fund-1", skillId: "react_fundamentals", title: "React Fundamentals Course", description: "Core concepts: components, JSX, props, state, hooks, and the rendering lifecycle.", level: "foundation", format: "course", estimatedMinutes: 120 },
  { id: "react-fund-2", skillId: "react_fundamentals", title: "Hooks Deep Dive Guide", description: "Practical guide to useState, useEffect, useRef, useMemo, and custom hooks.", level: "intermediate", format: "guide", estimatedMinutes: 60 },
  { id: "react-fund-3", skillId: "react_fundamentals", title: "Build a Task Manager App", description: "Hands-on exercise covering component composition, state, and event handling.", level: "foundation", format: "practice", estimatedMinutes: 90 },

  // --- state_management ---
  { id: "state-mgmt-1", skillId: "state_management", title: "State Management Foundations", description: "Understanding local state, lifting state, Context API, and when to use external stores.", level: "foundation", format: "course", estimatedMinutes: 90 },
  { id: "state-mgmt-2", skillId: "state_management", title: "Redux Toolkit & Zustand Comparison", description: "Intermediate guide comparing modern state management solutions with practical examples.", level: "intermediate", format: "guide", estimatedMinutes: 60 },
  { id: "state-mgmt-3", skillId: "state_management", title: "Refactor to Context API Exercise", description: "Practice converting prop-drilling patterns to React Context.", level: "intermediate", format: "practice", estimatedMinutes: 45 },

  // --- async_data_fetching ---
  { id: "async-1", skillId: "async_data_fetching", title: "Async Data Fetching in React", description: "Fundamentals of fetch, async/await, loading states, error handling in React apps.", level: "foundation", format: "course", estimatedMinutes: 90 },
  { id: "async-2", skillId: "async_data_fetching", title: "SWR & React Query Patterns", description: "Guide to data fetching libraries: caching, revalidation, optimistic updates.", level: "intermediate", format: "guide", estimatedMinutes: 60 },
  { id: "async-3", skillId: "async_data_fetching", title: "Loading, Error & Retry States Exercise", description: "Build robust data fetching UIs with proper loading, error, and retry patterns.", level: "intermediate", format: "practice", estimatedMinutes: 45 },

  // --- testing ---
  { id: "test-1", skillId: "testing", title: "React Testing Fundamentals", description: "Introduction to testing with Jest and React Testing Library.", level: "foundation", format: "course", estimatedMinutes: 120 },
  { id: "test-2", skillId: "testing", title: "Write Your First Component Tests", description: "Step-by-step practice writing unit and integration tests for React components.", level: "foundation", format: "practice", estimatedMinutes: 60 },
  { id: "test-3", skillId: "testing", title: "Testing Checklist for Frontend PRs", description: "Checklist of what to test before submitting a PR: renders, interactions, edge cases.", level: "intermediate", format: "checklist", estimatedMinutes: 15 },

  // --- typescript ---
  { id: "ts-1", skillId: "typescript", title: "TypeScript for React Developers", description: "Foundational TypeScript course covering types, interfaces, generics in a React context.", level: "foundation", format: "course", estimatedMinutes: 120 },
  { id: "ts-2", skillId: "typescript", title: "Typing Props, Hooks & Events", description: "Intermediate guide to typing component props, hook return values, and event handlers.", level: "intermediate", format: "guide", estimatedMinutes: 45 },
  { id: "ts-3", skillId: "typescript", title: "Type Safety Checklist", description: "Quick checklist: avoid any, use strict mode, type API responses, leverage discriminated unions.", level: "intermediate", format: "checklist", estimatedMinutes: 10 },

  // --- component_architecture ---
  { id: "comp-arch-1", skillId: "component_architecture", title: "Component Design Patterns", description: "Guide to composition, render props, compound components, and container/presentational split.", level: "intermediate", format: "guide", estimatedMinutes: 60 },
  { id: "comp-arch-2", skillId: "component_architecture", title: "Advanced Component Patterns", description: "Higher-order components, polymorphic components, and headless UI patterns.", level: "advanced", format: "guide", estimatedMinutes: 45 },
  { id: "comp-arch-3", skillId: "component_architecture", title: "Refactor a Component Tree Exercise", description: "Practice breaking down a monolithic component into reusable, composable pieces.", level: "intermediate", format: "practice", estimatedMinutes: 60 },

  // --- performance_awareness ---
  { id: "perf-1", skillId: "performance_awareness", title: "React Performance Optimization Guide", description: "Memoization, virtualization, code splitting, and profiling techniques.", level: "intermediate", format: "guide", estimatedMinutes: 60 },
  { id: "perf-2", skillId: "performance_awareness", title: "Performance Profiling Exercise", description: "Use React DevTools and Lighthouse to find and fix performance bottlenecks.", level: "intermediate", format: "practice", estimatedMinutes: 45 },
  { id: "perf-3", skillId: "performance_awareness", title: "Performance Review Checklist", description: "Checklist: unnecessary re-renders, bundle size, lazy loading, image optimization.", level: "intermediate", format: "checklist", estimatedMinutes: 10 },

  // --- accessibility_awareness ---
  { id: "a11y-1", skillId: "accessibility_awareness", title: "Web Accessibility Fundamentals", description: "Introduction to WCAG, ARIA, semantic HTML, keyboard navigation, and screen readers.", level: "foundation", format: "course", estimatedMinutes: 90 },
  { id: "a11y-2", skillId: "accessibility_awareness", title: "Accessible React Components Guide", description: "Guide to building accessible forms, modals, menus, and interactive elements in React.", level: "intermediate", format: "guide", estimatedMinutes: 45 },
  { id: "a11y-3", skillId: "accessibility_awareness", title: "Accessibility Audit Checklist", description: "Checklist for auditing: focus management, color contrast, alt text, landmark roles.", level: "foundation", format: "checklist", estimatedMinutes: 15 },
];

export function getCatalogForSkill(skillId: string): LearningContentItem[] {
  return LEARNING_CATALOG.filter((item) => item.skillId === skillId);
}

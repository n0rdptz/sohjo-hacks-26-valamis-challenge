import type { GapSeverity, GapPriority, ContributorGapProfile } from "@/types";

export function getSeverityColor(severity: GapSeverity): "success" | "info" | "warning" | "error" {
  if (severity === "none") return "success";
  if (severity === "low") return "info";
  if (severity === "medium") return "warning";
  return "error";
}

export function getPriorityColor(priority: GapPriority): "default" | "info" | "warning" | "error" {
  if (priority === "low") return "default";
  if (priority === "medium") return "info";
  if (priority === "high") return "warning";
  return "error";
}

export function countTotalGaps(profiles: ContributorGapProfile[]): number {
  return profiles.reduce((sum, p) => sum + p.totalGapCount, 0);
}

export function countHighPriorityGaps(profiles: ContributorGapProfile[]): number {
  return profiles.reduce((sum, p) => sum + p.highPriorityGapCount, 0);
}

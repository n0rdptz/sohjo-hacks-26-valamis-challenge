"use client";

import { useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useAppState } from "@/context/AppStateContext";
import { SKILL_DEFINITIONS, getRoleById, getSkillById } from "@/lib/skill-taxonomy";
import type { RawEvidenceType, ImportanceLevel } from "@/types";

const TYPE_LABELS: Record<RawEvidenceType, string> = {
  commit_authored: "Commits",
  pr_opened: "PRs",
  file_touched: "Files",
  testing_file_detected: "Testing",
  typescript_usage_detected: "TypeScript",
  react_hooks_detected: "React Hooks",
  state_management_detected: "State Mgmt",
  async_code_detected: "Async",
};

const IMPORTANCE_COLOR: Record<ImportanceLevel, "primary" | "default" | "default"> = {
  high: "primary",
  medium: "default",
  low: "default",
};

export default function SkillsPage() {
  const { rawEvidence, selectedRoleId } = useAppState();
  const role = getRoleById(selectedRoleId);

  const typeCounts = useMemo(() => {
    const counts = new Map<RawEvidenceType, number>();
    for (const e of rawEvidence) {
      counts.set(e.type, (counts.get(e.type) ?? 0) + 1);
    }
    return counts;
  }, [rawEvidence]);

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Skills</Typography>

      {/* A. Evidence Summary */}
      {rawEvidence.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>Evidence Summary</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {rawEvidence.length} evidence items generated
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {Array.from(typeCounts.entries()).map(([type, count]) => (
              <Chip
                key={type}
                label={`${TYPE_LABELS[type]}: ${count}`}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}

      {/* B. Skills Taxonomy */}
      <Typography variant="h6" gutterBottom>Skills Taxonomy</Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {SKILL_DEFINITIONS.map((skill) => (
          <Grid key={skill.id} size={{ xs: 12, md: 6 }}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600}>
                  {skill.label}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {skill.description}
                </Typography>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <Chip label={skill.category} size="small" />
                  <Chip
                    label={skill.priority}
                    size="small"
                    variant={skill.priority === "core" ? "filled" : "outlined"}
                    color={skill.priority === "core" ? "primary" : "default"}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* C. Role Requirements */}
      {role && (
        <>
          <Typography variant="h6" gutterBottom>
            Role: {role.label}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {role.description}
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Skill</TableCell>
                  <TableCell align="center">Target</TableCell>
                  <TableCell align="center">Minimum</TableCell>
                  <TableCell align="center">Importance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {role.requiredSkills.map((req) => {
                  const skill = getSkillById(req.skillId);
                  return (
                    <TableRow key={req.skillId}>
                      <TableCell>{skill?.label ?? req.skillId}</TableCell>
                      <TableCell align="center">{(req.targetScore * 100).toFixed(0)}%</TableCell>
                      <TableCell align="center">{(req.minimumScore * 100).toFixed(0)}%</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={req.importance}
                          size="small"
                          color={IMPORTANCE_COLOR[req.importance]}
                          variant={req.importance === "low" ? "outlined" : "filled"}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
}

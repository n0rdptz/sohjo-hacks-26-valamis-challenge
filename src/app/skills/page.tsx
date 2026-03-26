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
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import LinearProgress from "@mui/material/LinearProgress";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAppState } from "@/context/AppStateContext";
import { SKILL_DEFINITIONS, getRoleById, getSkillById } from "@/lib/skill-taxonomy";
import type { RawEvidenceType, ImportanceLevel, ContributorSkillProfile } from "@/types";

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

const IMPORTANCE_COLOR: Record<ImportanceLevel, "primary" | "default"> = {
  high: "primary",
  medium: "default",
  low: "default",
};

function avgScore(profile: ContributorSkillProfile): number {
  const scores = profile.skillScores.filter((s) => s.signalCount > 0);
  if (scores.length === 0) return 0;
  return scores.reduce((sum, s) => sum + s.normalizedScore, 0) / scores.length;
}

export default function SkillsPage() {
  const { rawEvidence, contributorProfiles, selectedRoleId } = useAppState();
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

      {/* A. Contributor Skill Profiles */}
      {contributorProfiles.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>Contributor Skill Profiles</Typography>
          {contributorProfiles.map((profile) => {
            const avg = avgScore(profile);
            return (
              <Accordion key={profile.contributorLogin} defaultExpanded={contributorProfiles.length <= 2}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
                    <Typography fontWeight={600}>{profile.contributorLogin}</Typography>
                    <Chip
                      label={`avg: ${(avg * 100).toFixed(0)}%`}
                      size="small"
                      color={avg >= 0.7 ? "success" : avg >= 0.4 ? "warning" : "default"}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Skill</TableCell>
                          <TableCell sx={{ minWidth: 180 }}>Score</TableCell>
                          <TableCell align="center">Confidence</TableCell>
                          <TableCell align="center">Signals</TableCell>
                          <TableCell>Summary</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {profile.skillScores.map((ss) => {
                          const skill = getSkillById(ss.skillId);
                          const pct = Math.round(ss.normalizedScore * 100);
                          return (
                            <TableRow key={ss.skillId}>
                              <TableCell>{skill?.label ?? ss.skillId}</TableCell>
                              <TableCell>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <LinearProgress
                                    variant="determinate"
                                    value={pct}
                                    sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                                    color={pct >= 70 ? "success" : pct >= 40 ? "warning" : "inherit"}
                                  />
                                  <Typography variant="body2" sx={{ minWidth: 36, textAlign: "right" }}>
                                    {pct}%
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell align="center">
                                {ss.confidence > 0 ? `${(ss.confidence * 100).toFixed(0)}%` : "—"}
                              </TableCell>
                              <TableCell align="center">{ss.signalCount}</TableCell>
                              <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                  {ss.summary}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      )}

      {/* B. Evidence Summary */}
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

      {/* C. Skills Taxonomy */}
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

      {/* D. Role Requirements */}
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

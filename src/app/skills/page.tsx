"use client";

import { useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
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
import PageHeader from "@/components/PageHeader";
import SkillsSummaryCards from "@/components/SkillsSummaryCards";
import ContributorSkillsAccordion from "@/components/ContributorSkillsAccordion";
import type { ImportanceLevel, GithubContributor } from "@/types";

const IMPORTANCE_COLOR: Record<ImportanceLevel, "primary" | "default"> = {
  high: "primary",
  medium: "default",
  low: "default",
};

export default function SkillsPage() {
  const { analysis, contributorProfiles, skillSignals, selectedRoleId } = useAppState();
  const role = getRoleById(selectedRoleId);

  const contributorMap = useMemo(() => {
    const map = new Map<string, GithubContributor>();
    if (analysis?.contributors) {
      for (const c of analysis.contributors) {
        map.set(c.login, c);
      }
    }
    return map;
  }, [analysis]);

  const signalsByContributor = useMemo(() => {
    const map = new Map<string, typeof skillSignals>();
    for (const s of skillSignals) {
      const arr = map.get(s.contributorLogin);
      if (arr) arr.push(s);
      else map.set(s.contributorLogin, [s]);
    }
    return map;
  }, [skillSignals]);

  return (
    <Box sx={{ py: 4 }}>
      <PageHeader
        title="Skill Profiles"
        subtitle="Inferred skill assessments for each contributor based on repository evidence."
        infoBanner="These profiles are inferred from repository evidence and should be interpreted as probabilistic signals, not absolute truth."
      />

      {/* Empty state */}
      {!analysis && (
        <Alert severity="info" sx={{ mb: 4 }}>
          Load a GitHub repository first to generate contributor skill profiles.
        </Alert>
      )}

      {/* Summary cards */}
      {analysis && <SkillsSummaryCards />}

      {/* Contributor profiles */}
      {contributorProfiles.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>Contributor Profiles</Typography>
          {contributorProfiles.map((profile) => (
            <ContributorSkillsAccordion
              key={profile.contributorLogin}
              profile={profile}
              contributor={contributorMap.get(profile.contributorLogin)}
              signals={signalsByContributor.get(profile.contributorLogin) ?? []}
              defaultExpanded={contributorProfiles.length <= 2}
            />
          ))}
        </Box>
      )}

      {/* Skills Taxonomy */}
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

      {/* Role Requirements */}
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

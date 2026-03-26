"use client";

import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useAppState } from "@/context/AppStateContext";
import { getRoleById, getSkillById } from "@/lib/skill-taxonomy";
import { formatScore } from "@/lib/skills-ui";
import {
  buildTeamHeatmapCells,
  buildTeamSkillSummaries,
  buildTeamContributorSummaries,
} from "@/lib/team-heatmap";
import PageHeader from "@/components/PageHeader";
import TeamHeatmapTable from "@/components/TeamHeatmapTable";
import TeamSkillInsights from "@/components/TeamSkillInsights";
import TeamContributorInsights from "@/components/TeamContributorInsights";

export default function TeamPage() {
  const {
    analysis,
    contributorProfiles,
    contributorGapProfiles,
    contributorRecommendationProfiles,
    selectedRoleId,
  } = useAppState();

  const [riskyOnly, setRiskyOnly] = useState(false);
  const role = getRoleById(selectedRoleId);

  const cells = useMemo(() => {
    if (!role) return [];
    return buildTeamHeatmapCells(contributorProfiles, contributorGapProfiles, contributorRecommendationProfiles, role);
  }, [contributorProfiles, contributorGapProfiles, contributorRecommendationProfiles, role]);

  const skillSummaries = useMemo(() => {
    if (!role) return [];
    return buildTeamSkillSummaries(cells, role);
  }, [cells, role]);

  const contributorSummaries = useMemo(
    () => buildTeamContributorSummaries(contributorGapProfiles, contributorProfiles),
    [contributorGapProfiles, contributorProfiles],
  );

  const skillIds = useMemo(() => role?.requiredSkills.map((r) => r.skillId) ?? [], [role]);
  const contributorLogins = useMemo(
    () => contributorSummaries.map((c) => c.contributorLogin),
    [contributorSummaries],
  );
  const riskyLogins = useMemo(
    () => new Set(contributorGapProfiles.filter((p) => p.highPriorityGapCount > 0).map((p) => p.contributorLogin)),
    [contributorGapProfiles],
  );

  const weakestSkill = skillSummaries.length > 0
    ? [...skillSummaries].sort((a, b) => a.averageScore - b.averageScore)[0]
    : null;
  const strongestSkill = skillSummaries.length > 0
    ? [...skillSummaries].sort((a, b) => b.averageScore - a.averageScore)[0]
    : null;

  const totalHighGaps = contributorGapProfiles.reduce((s, p) => s + p.highPriorityGapCount, 0);

  return (
    <Box sx={{ py: 4 }}>
      <PageHeader
        title="Team Heatmap"
        subtitle="View team-wide capability coverage, identify weak spots, and spot high-risk skill areas at a glance."
        infoBanner="This heatmap identifies team-wide weak spots and concentrated development risks."
      />

      {!analysis && (
        <Alert severity="info">
          Load a GitHub repository first to build a team skill heatmap.
        </Alert>
      )}

      {analysis && contributorProfiles.length === 0 && (
        <Alert severity="warning">
          Not enough skill profile data to render the team heatmap yet.
        </Alert>
      )}

      {analysis && contributorProfiles.length > 0 && (
        <>
          {/* Summary cards */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {[
              { label: "Role", value: role?.label ?? "—" },
              { label: "Contributors", value: String(contributorProfiles.length) },
              { label: "Skills Tracked", value: String(skillIds.length) },
              { label: "Critical / High Gaps", value: String(totalHighGaps) },
              { label: "Weakest Skill", value: weakestSkill ? (getSkillById(weakestSkill.skillId)?.label ?? "—") : "—" },
              { label: "Strongest Skill", value: strongestSkill ? (getSkillById(strongestSkill.skillId)?.label ?? "—") : "—" },
            ].map((item) => (
              <Grid key={item.label} size={{ xs: 6, sm: 4 }}>
                <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                  <Typography variant="h6" fontWeight={600} fontSize="0.95rem">{item.value}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Toggle */}
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={<Switch checked={riskyOnly} onChange={(e) => setRiskyOnly(e.target.checked)} size="small" />}
              label="Show risky contributors only"
            />
          </Box>

          {/* Heatmap */}
          <TeamHeatmapTable
            cells={cells}
            skillIds={skillIds}
            contributorLogins={contributorLogins}
            riskyOnly={riskyOnly}
            riskyLogins={riskyLogins}
          />

          {/* Insights */}
          <TeamSkillInsights summaries={skillSummaries} />
          <TeamContributorInsights summaries={contributorSummaries} />
        </>
      )}
    </Box>
  );
}

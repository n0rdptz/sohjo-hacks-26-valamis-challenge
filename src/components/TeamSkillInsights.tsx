"use client";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import { getSkillById } from "@/lib/skill-taxonomy";
import { formatScore } from "@/lib/skills-ui";
import type { TeamSkillSummary } from "@/lib/team-heatmap";

interface Props {
  summaries: TeamSkillSummary[];
}

export default function TeamSkillInsights({ summaries }: Props) {
  const sorted = [...summaries].sort((a, b) => a.averageScore - b.averageScore);
  const weakest = sorted.slice(0, 3);
  const strongest = [...sorted].reverse().slice(0, 3);

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Weakest Skills</Typography>
          <List disablePadding dense>
            {weakest.map((s) => {
              const skill = getSkillById(s.skillId);
              return (
                <ListItem key={s.skillId} disableGutters>
                  <ListItemText
                    primary={skill?.label ?? s.skillId}
                    secondary={`Avg: ${formatScore(s.averageScore)} | ${s.contributorsWithGapCount} with gaps`}
                  />
                  {s.highPriorityGapCount > 0 && (
                    <Chip label={`${s.highPriorityGapCount} high/critical`} size="small" color="error" />
                  )}
                </ListItem>
              );
            })}
          </List>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Strongest Skills</Typography>
          <List disablePadding dense>
            {strongest.map((s) => {
              const skill = getSkillById(s.skillId);
              return (
                <ListItem key={s.skillId} disableGutters>
                  <ListItemText
                    primary={skill?.label ?? s.skillId}
                    secondary={`Avg: ${formatScore(s.averageScore)} | Confidence: ${formatScore(s.averageConfidence)}`}
                  />
                </ListItem>
              );
            })}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
}

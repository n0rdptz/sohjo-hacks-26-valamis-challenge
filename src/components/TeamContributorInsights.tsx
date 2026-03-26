"use client";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { formatScore } from "@/lib/skills-ui";
import type { TeamContributorSummary } from "@/lib/team-heatmap";

interface Props {
  summaries: TeamContributorSummary[];
}

export default function TeamContributorInsights({ summaries }: Props) {
  const top = summaries.slice(0, 3);
  if (top.length === 0) return null;

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
      <Typography variant="h6" gutterBottom>Highest-Risk Contributors</Typography>
      <List disablePadding dense>
        {top.map((c) => (
          <ListItem key={c.contributorLogin} disableGutters>
            <ListItemText
              primary={c.contributorLogin}
              secondary={`Avg score: ${formatScore(c.averageScore)} | ${c.totalGapCount} gaps`}
            />
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {c.highPriorityGapCount > 0 && (
                <Chip label={`${c.highPriorityGapCount} critical/high`} size="small" color="error" />
              )}
              <Chip label={`${c.totalGapCount} total`} size="small" variant="outlined" />
            </Box>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

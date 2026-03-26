"use client";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useAppState } from "@/context/AppStateContext";
import { getRoleById } from "@/lib/skill-taxonomy";
import { countTotalGaps, countHighPriorityGaps } from "@/lib/gaps-ui";

export default function GapSummaryCards() {
  const { contributorGapProfiles, selectedRoleId } = useAppState();
  const role = getRoleById(selectedRoleId);

  const items = [
    { label: "Role", value: role?.label ?? "—" },
    { label: "Contributors", value: String(contributorGapProfiles.length) },
    { label: "Total Gaps", value: String(countTotalGaps(contributorGapProfiles)) },
    { label: "Critical / High", value: String(countHighPriorityGaps(contributorGapProfiles)) },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      {items.map((item) => (
        <Grid key={item.label} size={{ xs: 6, md: 3 }}>
          <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {item.label}
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {item.value}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

"use client";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useAppState } from "@/context/AppStateContext";

export default function SkillsSummaryCards() {
  const { analysis, contributorProfiles, rawEvidence, skillSignals } = useAppState();

  const items = [
    { label: "Repository", value: analysis?.repositoryInfo?.fullName ?? "—" },
    { label: "Contributors", value: String(contributorProfiles.length) },
    { label: "Evidence", value: String(rawEvidence.length) },
    { label: "Signals", value: String(skillSignals.length) },
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

"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { useAppState } from "@/context/AppStateContext";

export default function TeamPage() {
  const { analysis } = useAppState();

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Team Heatmap
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Team heatmap coming next
      </Alert>

      {!analysis && (
        <Typography color="text.secondary">
          Analyze a repository first.
        </Typography>
      )}
    </Box>
  );
}

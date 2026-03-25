"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { useAppState } from "@/context/AppStateContext";

export default function GapsPage() {
  const { analysis } = useAppState();

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Skill Gaps
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Gap detection coming next
      </Alert>

      {!analysis && (
        <Typography color="text.secondary">
          Analyze a repository first.
        </Typography>
      )}
    </Box>
  );
}

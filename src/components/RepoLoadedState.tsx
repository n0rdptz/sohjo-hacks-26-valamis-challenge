"use client";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useAppState } from "@/context/AppStateContext";

export default function RepoLoadedState() {
  const { parsedRepo, reset } = useAppState();
  if (!parsedRepo) return null;

  return (
    <Paper variant="outlined" sx={{ p: 3, width: "100%" }}>
      <Typography variant="h6" gutterBottom>
        {parsedRepo.owner}/{parsedRepo.repo}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {parsedRepo.originalUrl}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Loaded at: {new Date(parsedRepo.parsedAt).toLocaleString()}
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Button variant="outlined" color="error" onClick={reset}>
          Reset
        </Button>
      </Box>
    </Paper>
  );
}

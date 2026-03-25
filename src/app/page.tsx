"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import RepoInputForm from "@/components/RepoInputForm";
import RepoLoadedState from "@/components/RepoLoadedState";
import { useAppState } from "@/context/AppStateContext";

export default function HomePage() {
  const { parsedRepo } = useAppState();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        maxWidth: 600,
        mx: "auto",
        gap: 3,
      }}
    >
      <Typography variant="h4" fontWeight={700}>
        SkillScope
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center">
        Analyze developer skills and contributions based on any public GitHub repository.
      </Typography>

      {parsedRepo ? <RepoLoadedState /> : <RepoInputForm />}
    </Box>
  );
}

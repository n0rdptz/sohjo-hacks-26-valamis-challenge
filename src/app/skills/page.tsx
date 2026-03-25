"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import { useAppState } from "@/context/AppStateContext";

export default function SkillsPage() {
  const { analysis } = useAppState();

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Skills
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Skill inference coming next
      </Alert>

      {analysis ? (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Chip label={`${analysis.contributors?.length ?? 0} contributors`} />
          <Chip label={`${analysis.commits?.length ?? 0} commits`} />
          <Chip label={`${analysis.pullRequests?.length ?? 0} pull requests`} />
          <Chip label={`${analysis.repositoryContents?.length ?? 0} root files`} />
        </Box>
      ) : (
        <Typography color="text.secondary">
          Analyze a repository first to see data summary.
        </Typography>
      )}
    </Box>
  );
}

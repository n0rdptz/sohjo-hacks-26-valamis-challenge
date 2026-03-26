"use client";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import StarIcon from "@mui/icons-material/Star";
import ForkRightIcon from "@mui/icons-material/ForkRight";
import PeopleIcon from "@mui/icons-material/People";
import CommitIcon from "@mui/icons-material/Commit";
import MergeIcon from "@mui/icons-material/MergeType";
import FolderIcon from "@mui/icons-material/Folder";
import QuickNavCards from "./QuickNavCards";
import { useAppState } from "@/context/AppStateContext";

export default function RepoLoadedState() {
  const { parsedRepo, analysis, rawEvidence, contributorGapProfiles, isDemoMode, loadedAt, reset } = useAppState();
  if (!parsedRepo) return null;

  const info = analysis?.repositoryInfo;
  const totalGaps = contributorGapProfiles.reduce((s, p) => s + p.totalGapCount, 0);

  return (
    <Paper variant="outlined" sx={{ p: 3, width: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Typography variant="h6">
          {parsedRepo.owner}/{parsedRepo.repo}
        </Typography>
        {isDemoMode && <Chip label="Demo Mode" size="small" color="secondary" />}
      </Box>

      {info?.description && (
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {info.description}
        </Typography>
      )}

      {loadedAt && (
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Loaded at: {new Date(loadedAt).toLocaleString()}
        </Typography>
      )}

      {info && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1.5 }}>
          <Chip icon={<StarIcon />} label={`${info.stars.toLocaleString()} stars`} size="small" />
          <Chip icon={<ForkRightIcon />} label={`${info.forks.toLocaleString()} forks`} size="small" />
          {info.language && <Chip label={info.language} size="small" variant="outlined" />}
        </Box>
      )}

      {analysis && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1.5 }}>
          <Chip icon={<PeopleIcon />} label={`${analysis.contributors?.length ?? 0} contributors`} size="small" variant="outlined" />
          <Chip icon={<CommitIcon />} label={`${analysis.commits?.length ?? 0} commits`} size="small" variant="outlined" />
          <Chip icon={<MergeIcon />} label={`${analysis.pullRequests?.length ?? 0} PRs`} size="small" variant="outlined" />
          <Chip icon={<FolderIcon />} label={`${analysis.repositoryContents?.length ?? 0} root items`} size="small" variant="outlined" />
          <Chip label={`${rawEvidence.length} evidence`} size="small" variant="outlined" />
          <Chip label={`${totalGaps} gaps`} size="small" variant="outlined" color={totalGaps > 0 ? "warning" : "success"} />
        </Box>
      )}

      <QuickNavCards />

      <Box sx={{ mt: 2 }}>
        <Button variant="outlined" color="error" onClick={reset} size="small">
          Reset
        </Button>
      </Box>
    </Paper>
  );
}

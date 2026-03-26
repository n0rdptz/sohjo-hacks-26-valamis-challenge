"use client";

import { useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { useAppState } from "@/context/AppStateContext";
import type { RawEvidenceType } from "@/types";

const TYPE_LABELS: Record<RawEvidenceType, string> = {
  commit_authored: "Commits",
  pr_opened: "PRs",
  file_touched: "Files",
  testing_file_detected: "Testing",
  typescript_usage_detected: "TypeScript",
  react_hooks_detected: "React Hooks",
  state_management_detected: "State Mgmt",
  async_code_detected: "Async",
};

const PREVIEW_LIMIT = 20;

export default function SkillsPage() {
  const { analysis, rawEvidence } = useAppState();

  const typeCounts = useMemo(() => {
    const counts = new Map<RawEvidenceType, number>();
    for (const e of rawEvidence) {
      counts.set(e.type, (counts.get(e.type) ?? 0) + 1);
    }
    return counts;
  }, [rawEvidence]);

  if (!analysis) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>Skills</Typography>
        <Typography color="text.secondary">
          Analyze a repository first to see evidence data.
        </Typography>
      </Box>
    );
  }

  if (rawEvidence.length === 0) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>Skills</Typography>
        <Alert severity="warning">No evidence generated from the loaded data.</Alert>
      </Box>
    );
  }

  const preview = rawEvidence.slice(0, PREVIEW_LIMIT);

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Skills</Typography>

      <Alert severity="info" sx={{ mb: 2 }}>
        Skill inference coming next. Showing raw evidence preview.
      </Alert>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {rawEvidence.length} evidence items generated
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
        {Array.from(typeCounts.entries()).map(([type, count]) => (
          <Chip
            key={type}
            label={`${TYPE_LABELS[type]}: ${count}`}
            size="small"
            variant="outlined"
          />
        ))}
      </Box>

      <List disablePadding>
        {preview.map((e, i) => (
          <Box key={e.id}>
            {i > 0 && <Divider />}
            <ListItem>
              <ListItemText
                primary={e.description}
                secondary={`${e.type} | ${e.contributorLogin}`}
              />
              <Chip label={TYPE_LABELS[e.type]} size="small" sx={{ ml: 1, flexShrink: 0 }} />
            </ListItem>
          </Box>
        ))}
      </List>

      {rawEvidence.length > PREVIEW_LIMIT && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          ...and {rawEvidence.length - PREVIEW_LIMIT} more
        </Typography>
      )}
    </Box>
  );
}

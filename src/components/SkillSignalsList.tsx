"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import type { SkillSignal } from "@/types";
import { formatScore } from "@/lib/skills-ui";

const MAX_SIGNALS = 5;

export default function SkillSignalsList({ signals }: { signals: SkillSignal[] }) {
  if (signals.length === 0) return null;

  const shown = signals.slice(0, MAX_SIGNALS);
  const remaining = signals.length - MAX_SIGNALS;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, py: 1 }}>
      {shown.map((s) => (
        <Box key={s.id} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            label={s.sourceEvidenceType.replace(/_/g, " ")}
            size="small"
            variant="outlined"
            sx={{ fontSize: "0.7rem", height: 22 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
            {s.explanation}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
            {formatScore(s.score)} / {formatScore(s.confidence)}
          </Typography>
        </Box>
      ))}
      {remaining > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ pl: 1 }}>
          +{remaining} more signal{remaining > 1 ? "s" : ""}
        </Typography>
      )}
    </Box>
  );
}

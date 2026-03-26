"use client";

import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import type { TeamHeatmapCell } from "@/lib/team-heatmap";
import { getHeatmapCellColor } from "@/lib/team-heatmap";
import { formatScore } from "@/lib/skills-ui";

interface Props {
  cell: TeamHeatmapCell;
  skillLabel: string;
}

export default function HeatmapCell({ cell, skillLabel }: Props) {
  const pct = Math.round(cell.score * 100);
  const bgcolor = getHeatmapCellColor(cell);
  const lowConf = cell.confidence < 0.5;

  const tooltipContent = (
    <Box sx={{ p: 0.5 }}>
      <Typography variant="subtitle2">{cell.contributorLogin} / {skillLabel}</Typography>
      <Typography variant="body2">
        Score: {formatScore(cell.score)} | Target: {formatScore(cell.targetScore)} | Min: {formatScore(cell.minimumScore)}
      </Typography>
      <Typography variant="body2">
        Severity: {cell.severity} | Priority: {cell.priority}
      </Typography>
      <Typography variant="body2">
        Confidence: {formatScore(cell.confidence)} | Signals: {cell.signalCount}
      </Typography>
      {cell.recommendationTitle && (
        <Typography variant="body2" sx={{ mt: 0.5, fontStyle: "italic" }}>
          Recommended: {cell.recommendationTitle}
        </Typography>
      )}
    </Box>
  );

  return (
    <Tooltip title={tooltipContent} arrow placement="top">
      <Box
        sx={{
          bgcolor,
          px: 1,
          py: 0.75,
          textAlign: "center",
          minWidth: 56,
          borderRadius: 0.5,
          border: lowConf ? "1px dashed" : "1px solid transparent",
          borderColor: lowConf ? "text.disabled" : "transparent",
          cursor: "default",
        }}
      >
        <Typography variant="body2" fontWeight={500} fontSize="0.8rem">
          {pct}%
        </Typography>
      </Box>
    </Tooltip>
  );
}

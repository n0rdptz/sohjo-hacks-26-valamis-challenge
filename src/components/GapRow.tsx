"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import LinearProgress from "@mui/material/LinearProgress";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { getSkillById } from "@/lib/skill-taxonomy";
import { formatScore } from "@/lib/skills-ui";
import { getSeverityColor, getPriorityColor } from "@/lib/gaps-ui";
import SkillRecommendationsList from "./SkillRecommendationsList";
import type { SkillGap, SkillRecommendation } from "@/types";

interface Props {
  gap: SkillGap;
  recommendation?: SkillRecommendation;
}

export default function GapRow({ gap, recommendation }: Props) {
  const [open, setOpen] = useState(false);
  const skill = getSkillById(gap.skillId);
  const pct = Math.round(gap.actualScore * 100);
  const hasRec = recommendation && recommendation.recommendedItems.length > 0;

  return (
    <>
      <TableRow hover>
        <TableCell>
          {hasRec && (
            <IconButton size="small" onClick={() => setOpen(!open)} sx={{ mr: 0.5 }}>
              {open ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
            </IconButton>
          )}
          <Typography component="span" variant="body2" fontWeight={500}>
            {skill?.label ?? gap.skillId}
          </Typography>
        </TableCell>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LinearProgress
              variant="determinate"
              value={pct}
              color={gap.severity === "none" ? "success" : gap.severity === "high" ? "error" : "warning"}
              sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
            />
            <Typography variant="body2" sx={{ minWidth: 36, textAlign: "right" }}>
              {formatScore(gap.actualScore)}
            </Typography>
          </Box>
        </TableCell>
        <TableCell align="center">{formatScore(gap.targetScore)}</TableCell>
        <TableCell align="center">{formatScore(gap.minimumScore)}</TableCell>
        <TableCell align="center">
          <Chip label={gap.severity} size="small" color={getSeverityColor(gap.severity)} />
        </TableCell>
        <TableCell align="center">
          <Chip label={gap.priority} size="small" color={getPriorityColor(gap.priority)} />
        </TableCell>
        <TableCell>
          <Typography variant="body2" color="text.secondary">{gap.explanation}</Typography>
        </TableCell>
      </TableRow>
      {hasRec && (
        <TableRow>
          <TableCell colSpan={7} sx={{ py: 0, borderBottom: open ? undefined : "none" }}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ pl: 5, pr: 2, pb: 1 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Recommended Learning
                </Typography>
                <SkillRecommendationsList
                  items={recommendation!.recommendedItems}
                  reason={recommendation!.reason}
                />
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

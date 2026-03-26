"use client";

import { useState } from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SkillSignalsList from "./SkillSignalsList";
import {
  formatScore,
  getScoreStatus,
  scoreStatusColor,
  getConfidenceStatus,
  confidenceStatusColor,
} from "@/lib/skills-ui";
import type { SkillScore, SkillSignal, SkillDefinition } from "@/types";

interface Props {
  skillScore: SkillScore;
  signals: SkillSignal[];
  skillDef: SkillDefinition;
}

export default function SkillScoreRow({ skillScore, signals, skillDef }: Props) {
  const [open, setOpen] = useState(false);
  const pct = Math.round(skillScore.normalizedScore * 100);
  const scoreStatus = getScoreStatus(skillScore.normalizedScore);
  const confStatus = getConfidenceStatus(skillScore.confidence);

  return (
    <>
      <TableRow hover>
        <TableCell>
          {signals.length > 0 && (
            <IconButton size="small" onClick={() => setOpen(!open)} sx={{ mr: 0.5 }}>
              {open ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
            </IconButton>
          )}
          <Typography component="span" variant="body2" fontWeight={500}>
            {skillDef.label}
          </Typography>
          <Box component="span" sx={{ ml: 0.75 }}>
            <Chip
              label={skillDef.priority}
              size="small"
              variant={skillDef.priority === "core" ? "filled" : "outlined"}
              color={skillDef.priority === "core" ? "primary" : "default"}
              sx={{ height: 20, fontSize: "0.65rem" }}
            />
          </Box>
        </TableCell>
        <TableCell sx={{ minWidth: 160 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LinearProgress
              variant="determinate"
              value={pct}
              color={scoreStatus === "strong" ? "success" : scoreStatus === "moderate" ? "warning" : "inherit"}
              sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
            />
            <Typography variant="body2" sx={{ minWidth: 36, textAlign: "right" }}>
              {formatScore(skillScore.normalizedScore)}
            </Typography>
          </Box>
        </TableCell>
        <TableCell align="center">
          {skillScore.confidence > 0 ? (
            <Chip
              label={confStatus}
              size="small"
              color={confidenceStatusColor(confStatus)}
              sx={{ height: 22, fontSize: "0.7rem" }}
            />
          ) : (
            "—"
          )}
        </TableCell>
        <TableCell align="center">{skillScore.signalCount}</TableCell>
        <TableCell>
          <Typography variant="body2" color="text.secondary">
            {skillScore.summary}
          </Typography>
        </TableCell>
      </TableRow>

      {signals.length > 0 && (
        <TableRow>
          <TableCell colSpan={5} sx={{ py: 0, borderBottom: open ? undefined : "none" }}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ pl: 5, pr: 2, pb: 1 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Signal Details
                </Typography>
                <SkillSignalsList signals={signals} />
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

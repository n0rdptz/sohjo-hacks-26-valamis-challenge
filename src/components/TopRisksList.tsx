"use client";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import { getSkillById } from "@/lib/skill-taxonomy";
import { formatScore } from "@/lib/skills-ui";
import { getSeverityColor, getPriorityColor } from "@/lib/gaps-ui";
import type { SkillGap } from "@/types";

interface Props {
  gaps: SkillGap[];
}

export default function TopRisksList({ gaps }: Props) {
  if (gaps.length === 0) return null;

  return (
    <Paper variant="outlined" sx={{ mb: 4, p: 2 }}>
      <Typography variant="h6" gutterBottom>Top Risks</Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Contributor</TableCell>
              <TableCell>Skill</TableCell>
              <TableCell align="center">Actual</TableCell>
              <TableCell align="center">Target</TableCell>
              <TableCell align="center">Severity</TableCell>
              <TableCell align="center">Priority</TableCell>
              <TableCell>Explanation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gaps.map((gap, i) => {
              const skill = getSkillById(gap.skillId);
              return (
                <TableRow key={`${gap.contributorLogin}-${gap.skillId}-${i}`}>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>{gap.contributorLogin}</Typography>
                  </TableCell>
                  <TableCell>{skill?.label ?? gap.skillId}</TableCell>
                  <TableCell align="center">{formatScore(gap.actualScore)}</TableCell>
                  <TableCell align="center">{formatScore(gap.targetScore)}</TableCell>
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
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

"use client";

import { useMemo } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import HeatmapCell from "./HeatmapCell";
import { getSkillById } from "@/lib/skill-taxonomy";
import type { TeamHeatmapCell } from "@/lib/team-heatmap";

interface Props {
  cells: TeamHeatmapCell[];
  skillIds: string[];
  contributorLogins: string[];
  riskyOnly: boolean;
  riskyLogins: Set<string>;
}

export default function TeamHeatmapTable({ cells, skillIds, contributorLogins, riskyOnly, riskyLogins }: Props) {
  const cellMap = useMemo(() => {
    const map = new Map<string, TeamHeatmapCell>();
    for (const c of cells) map.set(`${c.contributorLogin}::${c.skillId}`, c);
    return map;
  }, [cells]);

  const visibleLogins = riskyOnly
    ? contributorLogins.filter((l) => riskyLogins.has(l))
    : contributorLogins;

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, position: "sticky", left: 0, bgcolor: "background.paper", zIndex: 1 }}>
              Contributor
            </TableCell>
            {skillIds.map((id) => {
              const skill = getSkillById(id);
              return (
                <TableCell key={id} align="center" sx={{ fontWeight: 600, whiteSpace: "nowrap", fontSize: "0.75rem" }}>
                  {skill?.label ?? id}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleLogins.map((login) => (
            <TableRow key={login}>
              <TableCell sx={{ fontWeight: 500, position: "sticky", left: 0, bgcolor: "background.paper", zIndex: 1 }}>
                <Typography variant="body2" fontWeight={500}>{login}</Typography>
              </TableCell>
              {skillIds.map((skillId) => {
                const cell = cellMap.get(`${login}::${skillId}`);
                const skill = getSkillById(skillId);
                return (
                  <TableCell key={skillId} align="center" sx={{ p: 0.5 }}>
                    {cell ? (
                      <HeatmapCell cell={cell} skillLabel={skill?.label ?? skillId} />
                    ) : (
                      <Typography variant="body2" color="text.secondary">—</Typography>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

"use client";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import LinearProgress from "@mui/material/LinearProgress";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getSkillById } from "@/lib/skill-taxonomy";
import { formatScore } from "@/lib/skills-ui";
import { getSeverityColor, getPriorityColor } from "@/lib/gaps-ui";
import type { ContributorGapProfile, GithubContributor } from "@/types";

interface Props {
  gapProfile: ContributorGapProfile;
  contributor?: GithubContributor;
  defaultExpanded?: boolean;
}

export default function ContributorGapAccordion({ gapProfile, contributor, defaultExpanded = false }: Props) {
  return (
    <Accordion defaultExpanded={defaultExpanded}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", width: "100%" }}>
          {contributor && (
            <Avatar src={contributor.avatarUrl} alt={gapProfile.contributorLogin} sx={{ width: 32, height: 32 }} />
          )}
          <Typography fontWeight={600}>{gapProfile.contributorLogin}</Typography>
          <Chip
            label={`${gapProfile.totalGapCount} gap${gapProfile.totalGapCount !== 1 ? "s" : ""}`}
            size="small"
            color={gapProfile.totalGapCount > 0 ? "warning" : "success"}
          />
          {gapProfile.highPriorityGapCount > 0 && (
            <Chip
              label={`${gapProfile.highPriorityGapCount} critical/high`}
              size="small"
              color="error"
            />
          )}
          {gapProfile.topGap && (
            <Typography variant="body2" color="text.secondary">
              Top gap: {getSkillById(gapProfile.topGap.skillId)?.label ?? gapProfile.topGap.skillId}
            </Typography>
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Skill</TableCell>
                <TableCell sx={{ minWidth: 140 }}>Actual</TableCell>
                <TableCell align="center">Target</TableCell>
                <TableCell align="center">Min</TableCell>
                <TableCell align="center">Severity</TableCell>
                <TableCell align="center">Priority</TableCell>
                <TableCell>Explanation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {gapProfile.gaps.map((gap) => {
                const skill = getSkillById(gap.skillId);
                const pct = Math.round(gap.actualScore * 100);
                return (
                  <TableRow key={gap.skillId}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
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
                      <Typography variant="body2" color="text.secondary">
                        {gap.explanation}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );
}

"use client";

import { useMemo } from "react";
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GapRow from "./GapRow";
import { buildContributorSummary } from "@/lib/gaps-page-helpers";
import type { ContributorGapProfile, GithubContributor, SkillRecommendation } from "@/types";
import { getSkillById } from "@/lib/skill-taxonomy";

interface Props {
  gapProfile: ContributorGapProfile;
  contributor?: GithubContributor;
  recommendations?: Map<string, SkillRecommendation>;
  showHealthy?: boolean;
  highPriorityOnly?: boolean;
  defaultExpanded?: boolean;
}

export default function ContributorGapAccordion({
  gapProfile,
  contributor,
  recommendations,
  showHealthy = false,
  highPriorityOnly = false,
  defaultExpanded = false,
}: Props) {
  const visibleGaps = useMemo(() => {
    return gapProfile.gaps.filter((g) => {
      if (highPriorityOnly) return g.priority === "high" || g.priority === "critical";
      if (!showHealthy && g.severity === "none") return false;
      return true;
    });
  }, [gapProfile.gaps, showHealthy, highPriorityOnly]);

  const summary = buildContributorSummary(gapProfile);

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
            <Chip label={`${gapProfile.highPriorityGapCount} critical/high`} size="small" color="error" />
          )}
          {gapProfile.topGap && (
            <Typography variant="body2" color="text.secondary">
              Top gap: {getSkillById(gapProfile.topGap.skillId)?.label ?? gapProfile.topGap.skillId}
            </Typography>
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {summary}
        </Typography>
        {visibleGaps.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No gaps match the current filter.
          </Typography>
        ) : (
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
                {visibleGaps.map((gap) => (
                  <GapRow
                    key={gap.skillId}
                    gap={gap}
                    recommendation={recommendations?.get(gap.skillId)}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

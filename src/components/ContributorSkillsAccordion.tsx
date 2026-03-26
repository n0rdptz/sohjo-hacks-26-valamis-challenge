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
import SkillScoreRow from "./SkillScoreRow";
import {
  formatScore,
  getScoreStatus,
  scoreStatusColor,
  getContributorTopSkill,
  getContributorLowestSkill,
  getContributorAvgScore,
  sortSkillScores,
} from "@/lib/skills-ui";
import { getSkillById } from "@/lib/skill-taxonomy";
import type { ContributorSkillProfile, GithubContributor, SkillSignal } from "@/types";

interface Props {
  profile: ContributorSkillProfile;
  contributor?: GithubContributor;
  signals: SkillSignal[];
  defaultExpanded?: boolean;
}

export default function ContributorSkillsAccordion({
  profile,
  contributor,
  signals,
  defaultExpanded = false,
}: Props) {
  const avg = getContributorAvgScore(profile);
  const top = getContributorTopSkill(profile);
  const lowest = getContributorLowestSkill(profile);
  const sorted = useMemo(() => sortSkillScores(profile.skillScores), [profile.skillScores]);

  const signalsBySkill = useMemo(() => {
    const map = new Map<string, SkillSignal[]>();
    for (const s of signals) {
      const arr = map.get(s.skillId);
      if (arr) arr.push(s);
      else map.set(s.skillId, [s]);
    }
    return map;
  }, [signals]);

  return (
    <Accordion defaultExpanded={defaultExpanded}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", width: "100%" }}>
          {contributor && (
            <Avatar src={contributor.avatarUrl} alt={profile.contributorLogin} sx={{ width: 32, height: 32 }} />
          )}
          <Typography fontWeight={600}>{profile.contributorLogin}</Typography>
          {contributor && (
            <Typography variant="body2" color="text.secondary">
              {contributor.contributions.toLocaleString()} contributions
            </Typography>
          )}
          <Chip
            label={`avg: ${formatScore(avg)}`}
            size="small"
            color={scoreStatusColor(getScoreStatus(avg))}
          />
          {top && (
            <Chip
              label={`Best: ${top.label} ${formatScore(top.score)}`}
              size="small"
              variant="outlined"
              color="success"
            />
          )}
          {lowest && top && lowest.label !== top.label && (
            <Chip
              label={`Weakest: ${lowest.label} ${formatScore(lowest.score)}`}
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Skill</TableCell>
                <TableCell sx={{ minWidth: 160 }}>Score</TableCell>
                <TableCell align="center">Confidence</TableCell>
                <TableCell align="center">Signals</TableCell>
                <TableCell>Summary</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sorted.map((ss) => {
                const def = getSkillById(ss.skillId);
                if (!def) return null;
                return (
                  <SkillScoreRow
                    key={ss.skillId}
                    skillScore={ss}
                    signals={signalsBySkill.get(ss.skillId) ?? []}
                    skillDef={def}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );
}

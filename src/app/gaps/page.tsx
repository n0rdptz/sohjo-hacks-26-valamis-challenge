"use client";

import { useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { useAppState } from "@/context/AppStateContext";
import GapSummaryCards from "@/components/GapSummaryCards";
import ContributorGapAccordion from "@/components/ContributorGapAccordion";
import { countTotalGaps } from "@/lib/gaps-ui";
import type { GithubContributor } from "@/types";

export default function GapsPage() {
  const { analysis, contributorGapProfiles } = useAppState();

  const contributorMap = useMemo(() => {
    const map = new Map<string, GithubContributor>();
    if (analysis?.contributors) {
      for (const c of analysis.contributors) {
        map.set(c.login, c);
      }
    }
    return map;
  }, [analysis]);

  const totalGaps = countTotalGaps(contributorGapProfiles);

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Skill Gaps</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Compare inferred contributor skills against the target role requirements.
      </Typography>

      {!analysis && (
        <Alert severity="info">
          Load a GitHub repository first to detect skill gaps.
        </Alert>
      )}

      {analysis && (
        <>
          <GapSummaryCards />

          {totalGaps === 0 && (
            <Alert severity="success" sx={{ mb: 3 }}>
              No significant gaps detected for the selected role.
            </Alert>
          )}

          {contributorGapProfiles.map((gp) => (
            <ContributorGapAccordion
              key={gp.contributorLogin}
              gapProfile={gp}
              contributor={contributorMap.get(gp.contributorLogin)}
              defaultExpanded={contributorGapProfiles.length <= 2}
            />
          ))}
        </>
      )}
    </Box>
  );
}

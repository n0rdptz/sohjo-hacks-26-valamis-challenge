"use client";

import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useAppState } from "@/context/AppStateContext";
import PageHeader from "@/components/PageHeader";
import GapSummaryCards from "@/components/GapSummaryCards";
import TopRisksList from "@/components/TopRisksList";
import ContributorGapAccordion from "@/components/ContributorGapAccordion";
import { countTotalGaps } from "@/lib/gaps-ui";
import { getTopRiskGaps } from "@/lib/gaps-page-helpers";
import type { GithubContributor, SkillRecommendation } from "@/types";

export default function GapsPage() {
  const { analysis, contributorGapProfiles, contributorRecommendationProfiles } = useAppState();

  const [highPriorityOnly, setHighPriorityOnly] = useState(false);
  const [showHealthy, setShowHealthy] = useState(false);

  const contributorMap = useMemo(() => {
    const map = new Map<string, GithubContributor>();
    if (analysis?.contributors) {
      for (const c of analysis.contributors) map.set(c.login, c);
    }
    return map;
  }, [analysis]);

  const recsByContributor = useMemo(() => {
    const outer = new Map<string, Map<string, SkillRecommendation>>();
    for (const profile of contributorRecommendationProfiles) {
      const inner = new Map<string, SkillRecommendation>();
      for (const rec of profile.recommendations) inner.set(rec.skillId, rec);
      outer.set(profile.contributorLogin, inner);
    }
    return outer;
  }, [contributorRecommendationProfiles]);

  const topRisks = useMemo(
    () => getTopRiskGaps(contributorGapProfiles, 5),
    [contributorGapProfiles],
  );

  const totalGaps = countTotalGaps(contributorGapProfiles);

  const visibleProfiles = useMemo(() => {
    if (!highPriorityOnly) return contributorGapProfiles;
    return contributorGapProfiles.filter((p) => p.highPriorityGapCount > 0);
  }, [contributorGapProfiles, highPriorityOnly]);

  return (
    <Box sx={{ py: 4 }}>
      <PageHeader
        title="Skill Gaps"
        subtitle="Compare inferred contributor capabilities against the target role and surface the most important development needs."
        infoBanner="Gaps are detected by comparing inferred capability signals against the target role model."
      />

      {!analysis && (
        <Alert severity="info">
          Load a GitHub repository first to analyze skill gaps.
        </Alert>
      )}

      {analysis && (
        <>
          <GapSummaryCards />

          {topRisks.length > 0 && <TopRisksList gaps={topRisks} />}

          {totalGaps === 0 && (
            <Alert severity="success" sx={{ mb: 3 }}>
              No significant skill gaps detected for the selected role.
            </Alert>
          )}

          {totalGaps > 0 && (
            <>
              <Box sx={{ display: "flex", gap: 3, mb: 2, flexWrap: "wrap" }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={highPriorityOnly}
                      onChange={(e) => setHighPriorityOnly(e.target.checked)}
                      size="small"
                    />
                  }
                  label="High priority only"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={showHealthy}
                      onChange={(e) => setShowHealthy(e.target.checked)}
                      size="small"
                      disabled={highPriorityOnly}
                    />
                  }
                  label="Show healthy skills"
                />
              </Box>

              {visibleProfiles.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  No contributors match the current filter.
                </Typography>
              )}

              {visibleProfiles.map((gp) => (
                <ContributorGapAccordion
                  key={gp.contributorLogin}
                  gapProfile={gp}
                  contributor={contributorMap.get(gp.contributorLogin)}
                  recommendations={recsByContributor.get(gp.contributorLogin)}
                  showHealthy={showHealthy}
                  highPriorityOnly={highPriorityOnly}
                  defaultExpanded={visibleProfiles.length <= 2}
                />
              ))}
            </>
          )}
        </>
      )}
    </Box>
  );
}

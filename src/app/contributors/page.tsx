"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import PageHeader from "@/components/PageHeader";
import { useAppState } from "@/context/AppStateContext";

export default function ContributorsPage() {
  const { analysis } = useAppState();
  const contributors = analysis?.contributors;
  const totalContributions = contributors?.reduce((s, c) => s + c.contributions, 0) ?? 0;

  return (
    <Box sx={{ py: 4 }}>
      <PageHeader
        title="Contributors"
        subtitle="Top contributors to the analyzed repository."
      />

      {!contributors || contributors.length === 0 ? (
        <Alert severity="info">
          No contributor data available. Analyze a repository first.
        </Alert>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {contributors.length} contributors, {totalContributions.toLocaleString()} total contributions
          </Typography>
          <Grid container spacing={2}>
            {contributors.map((c) => (
              <Grid key={c.login} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card variant="outlined">
                  <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                    <Avatar src={c.avatarUrl} alt={c.login} sx={{ width: 64, height: 64 }} />
                    <Typography variant="subtitle1" fontWeight={600}>{c.login}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {c.contributions.toLocaleString()} contributions
                    </Typography>
                    <Link href={c.htmlUrl} target="_blank" rel="noopener noreferrer" variant="body2">
                      View profile
                    </Link>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
}

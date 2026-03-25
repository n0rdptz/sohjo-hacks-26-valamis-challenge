"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { useAppState } from "@/context/AppStateContext";

export default function ContributorsPage() {
  const { analysis } = useAppState();
  const contributors = analysis?.contributors;

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Contributors
      </Typography>

      {!contributors || contributors.length === 0 ? (
        <Alert severity="info">
          No contributor data available. Analyze a repository first.
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {contributors.map((c) => (
            <Grid key={c.login} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card variant="outlined">
                <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                  <Avatar
                    src={c.avatarUrl}
                    alt={c.login}
                    sx={{ width: 64, height: 64 }}
                  />
                  <Typography variant="subtitle1" fontWeight={600}>
                    {c.login}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {c.contributions.toLocaleString()} contributions
                  </Typography>
                  <Link
                    href={c.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="body2"
                  >
                    View profile
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

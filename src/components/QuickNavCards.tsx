"use client";

import Link from "next/link";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PeopleIcon from "@mui/icons-material/People";
import CodeIcon from "@mui/icons-material/Code";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import GridOnIcon from "@mui/icons-material/GridOn";

const NAV_ITEMS = [
  { label: "Contributors", href: "/contributors", icon: <PeopleIcon color="action" /> },
  { label: "Skills", href: "/skills", icon: <CodeIcon color="action" /> },
  { label: "Gaps", href: "/gaps", icon: <TrendingDownIcon color="action" /> },
  { label: "Team Heatmap", href: "/team", icon: <GridOnIcon color="action" /> },
];

export default function QuickNavCards() {
  return (
    <Grid container spacing={1.5} sx={{ mt: 1 }}>
      {NAV_ITEMS.map((item) => (
        <Grid key={item.href} size={{ xs: 6, sm: 3 }}>
          <Paper
            component={Link}
            href={item.href}
            variant="outlined"
            sx={{
              p: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 1,
              textDecoration: "none",
              color: "inherit",
              "&:hover": { bgcolor: "action.hover" },
              cursor: "pointer",
            }}
          >
            {item.icon}
            <Typography variant="body2" fontWeight={500}>{item.label}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InfoBanner from "./InfoBanner";

interface Props {
  title: string;
  subtitle?: string;
  infoBanner?: string;
}

export default function PageHeader({ title, subtitle, infoBanner }: Props) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h4" gutterBottom>{title}</Typography>
      {subtitle && (
        <Typography variant="body1" color="text.secondary" sx={{ mb: infoBanner ? 2 : 0 }}>
          {subtitle}
        </Typography>
      )}
      {infoBanner && <InfoBanner message={infoBanner} />}
    </Box>
  );
}

"use client";

import Alert from "@mui/material/Alert";
import type { AlertColor } from "@mui/material/Alert";

interface Props {
  message: string;
  severity?: AlertColor;
}

export default function InfoBanner({ message, severity = "info" }: Props) {
  return (
    <Alert severity={severity} sx={{ mb: 2 }}>
      {message}
    </Alert>
  );
}

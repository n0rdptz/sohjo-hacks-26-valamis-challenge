"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import type { LearningContentItem } from "@/types";

interface Props {
  items: LearningContentItem[];
  reason: string;
}

export default function SkillRecommendationsList({ items, reason }: Props) {
  return (
    <Box sx={{ py: 1 }}>
      <Typography variant="body2" sx={{ fontStyle: "italic", mb: 1.5 }} color="text.secondary">
        {reason}
      </Typography>

      {items.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No targeted learning content available yet.
        </Typography>
      ) : (
        <Stack spacing={1}>
          {items.map((item) => (
            <Card key={item.id} variant="outlined" sx={{ bgcolor: "action.hover" }}>
              <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                <Typography variant="subtitle2">{item.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {item.description}
                </Typography>
                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", alignItems: "center" }}>
                  <Chip label={item.format} size="small" variant="outlined" sx={{ height: 22, fontSize: "0.7rem" }} />
                  <Chip label={item.level} size="small" variant="outlined" sx={{ height: 22, fontSize: "0.7rem" }} />
                  <Chip label={`${item.estimatedMinutes} min`} size="small" sx={{ height: 22, fontSize: "0.7rem" }} />
                  {item.url && (
                    <Link href={item.url} target="_blank" rel="noopener noreferrer" variant="body2" sx={{ ml: 1 }}>
                      Open
                    </Link>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}

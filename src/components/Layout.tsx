"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import CodeIcon from "@mui/icons-material/Code";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import GridOnIcon from "@mui/icons-material/GridOn";
import { useAppState } from "@/context/AppStateContext";

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: <HomeIcon /> },
  { label: "Contributors", href: "/contributors", icon: <PeopleIcon /> },
  { label: "Skills", href: "/skills", icon: <CodeIcon /> },
  { label: "Gaps", href: "/gaps", icon: <TrendingDownIcon /> },
  { label: "Team", href: "/team", icon: <GridOnIcon /> },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { parsedRepo, isDemoMode } = useAppState();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap fontWeight={700}>
            SkillScope
          </Typography>
        </Toolbar>
        <List>
          {NAV_ITEMS.map((item) => (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={pathname === item.href}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>

        {parsedRepo && (
          <>
            <Divider sx={{ mt: "auto" }} />
            <Box sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Analyzing
              </Typography>
              <Typography variant="body2" fontWeight={500} noWrap>
                {parsedRepo.owner}/{parsedRepo.repo}
              </Typography>
              {isDemoMode && <Chip label="Demo" size="small" color="secondary" sx={{ mt: 0.5 }} />}
            </Box>
          </>
        )}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

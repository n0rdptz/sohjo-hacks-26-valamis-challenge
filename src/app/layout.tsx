import type { Metadata } from "next";
import ThemeRegistry from "@/components/ThemeRegistry";
import Layout from "@/components/Layout";
import { AppStateProvider } from "@/context/AppStateContext";

export const metadata: Metadata = {
  title: "SkillScope",
  description: "GitHub developer skills analyzer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <AppStateProvider>
            <Layout>{children}</Layout>
          </AppStateProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}

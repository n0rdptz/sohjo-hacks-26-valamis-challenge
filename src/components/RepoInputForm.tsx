"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { isValidGithubRepoUrl, parseGithubRepoUrl } from "@/lib/github";
import { useAppState } from "@/context/AppStateContext";

export default function RepoInputForm() {
  const { setRepo } = useAppState();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    const trimmed = url.trim();
    if (!isValidGithubRepoUrl(trimmed)) {
      setError("Enter a valid GitHub repo URL: https://github.com/owner/repo");
      return;
    }
    setError("");
    setLoading(true);

    // Simulate loading
    await new Promise((r) => setTimeout(r, 600));

    const parsed = parseGithubRepoUrl(trimmed)!;
    setRepo({
      originalUrl: trimmed,
      owner: parsed.owner,
      repo: parsed.repo,
      parsedAt: new Date().toISOString(),
    });
    setLoading(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
      <TextField
        label="GitHub Repository URL"
        placeholder="https://github.com/owner/repo"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
          if (error) setError("");
        }}
        error={!!error}
        helperText={error}
        fullWidth
        onKeyDown={(e) => {
          if (e.key === "Enter" && !loading) handleAnalyze();
        }}
      />
      <Button
        variant="contained"
        size="large"
        onClick={handleAnalyze}
        disabled={loading || !url.trim()}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Analyze"}
      </Button>
    </Box>
  );
}

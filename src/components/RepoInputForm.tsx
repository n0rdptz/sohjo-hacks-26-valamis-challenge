"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { isValidGithubRepoUrl, parseGithubRepoUrl } from "@/lib/github";
import { useAppState } from "@/context/AppStateContext";
import type { GithubAnalysisResult, ApiErrorResponse } from "@/types";

export default function RepoInputForm() {
  const { setRepo, setAnalysis } = useAppState();
  const [url, setUrl] = useState("");
  const [validationError, setValidationError] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    const trimmed = url.trim();
    if (!isValidGithubRepoUrl(trimmed)) {
      setValidationError("Enter a valid GitHub repo URL: https://github.com/owner/repo");
      return;
    }
    setValidationError("");
    setApiError("");
    setLoading(true);

    const parsed = parseGithubRepoUrl(trimmed)!;

    try {
      const res = await fetch("/api/github/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner: parsed.owner, repo: parsed.repo }),
      });

      if (!res.ok) {
        const err: ApiErrorResponse = await res.json().catch(() => ({
          error: "Unknown error",
          status: res.status,
        }));
        setApiError(err.error);
        setLoading(false);
        return;
      }

      const result: GithubAnalysisResult = await res.json();
      setRepo({
        originalUrl: trimmed,
        owner: parsed.owner,
        repo: parsed.repo,
        parsedAt: new Date().toISOString(),
      });
      setAnalysis(result);
    } catch {
      setApiError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
      <TextField
        label="GitHub Repository URL"
        placeholder="https://github.com/owner/repo"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
          if (validationError) setValidationError("");
          if (apiError) setApiError("");
        }}
        error={!!validationError}
        helperText={validationError}
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
      {apiError && (
        <Alert severity="error" onClose={() => setApiError("")}>
          {apiError}
        </Alert>
      )}
    </Box>
  );
}

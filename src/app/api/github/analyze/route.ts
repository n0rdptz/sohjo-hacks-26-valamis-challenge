import { NextRequest, NextResponse } from "next/server";
import { analyzeRepository } from "@/lib/github-analyzer";
import { GithubApiError } from "@/lib/github-api";

export async function POST(request: NextRequest) {
  let body: { owner?: string; repo?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body", status: 400 },
      { status: 400 },
    );
  }

  const { owner, repo } = body;
  if (!owner || !repo || typeof owner !== "string" || typeof repo !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid owner/repo", status: 400 },
      { status: 400 },
    );
  }

  try {
    const result = await analyzeRepository(owner, repo);
    return NextResponse.json(result);
  } catch (err: unknown) {
    if (err instanceof GithubApiError) {
      if (err.status === 404) {
        return NextResponse.json(
          { error: "Repository not found", status: 404, details: err.message },
          { status: 404 },
        );
      }
      if (err.status === 403 && err.rateLimitRemaining === "0") {
        return NextResponse.json(
          {
            error: "GitHub API rate limit exceeded. Try again later or add a GITHUB_TOKEN.",
            status: 403,
          },
          { status: 403 },
        );
      }
      return NextResponse.json(
        { error: "GitHub API error", status: err.status, details: err.message },
        { status: err.status },
      );
    }

    return NextResponse.json(
      { error: "Failed to analyze repository", status: 500 },
      { status: 500 },
    );
  }
}

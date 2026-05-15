import { NextResponse } from "next/server";
import { getGitHubProfile } from "@/lib/github";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ error: "username is required" }, { status: 400 });
    }

    const profile = await getGitHubProfile(username);

    if (!profile) {
      return NextResponse.json({ error: "GitHub user not found" }, { status: 404 });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("GitHub API error:", error);
    return NextResponse.json({ error: "Failed to fetch GitHub data" }, { status: 500 });
  }
}

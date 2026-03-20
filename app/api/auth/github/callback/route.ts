import { NextResponse } from "next/server";
import { importGitHubProfile } from "@/lib/github";
import { readProfileCookie, writeProfileCookie } from "@/lib/profile-cookie";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/dashboard?error=github_oauth", request.url));
  }

  try {
    const current = await readProfileCookie();
    const profile = await importGitHubProfile(current, code);
    await writeProfileCookie(profile);
    return NextResponse.redirect(new URL("/dashboard?connected=github", request.url));
  } catch {
    return NextResponse.redirect(new URL("/dashboard?error=github_import", request.url));
  }
}

import { NextResponse } from "next/server";
import { getGitHubAuthorizeUrl } from "@/lib/github";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.redirect(getGitHubAuthorizeUrl());
}

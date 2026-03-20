import { NextResponse } from "next/server";
import { importLinkedInProfile } from "@/lib/linkedin";
import { readProfileCookie, writeProfileCookie } from "@/lib/profile-cookie";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/dashboard?error=linkedin_oauth", request.url));
  }

  try {
    const current = await readProfileCookie();
    const profile = await importLinkedInProfile(current, code);
    await writeProfileCookie(profile);
    return NextResponse.redirect(new URL("/dashboard?connected=linkedin", request.url));
  } catch {
    return NextResponse.redirect(new URL("/dashboard?error=linkedin_import", request.url));
  }
}

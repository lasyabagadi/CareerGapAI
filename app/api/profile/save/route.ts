import { NextResponse } from "next/server";
import { writeProfileCookie } from "@/lib/profile-cookie";
import { ImportedProfile } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const profile = (await request.json()) as ImportedProfile;
  await writeProfileCookie(profile);
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { getLinkedInAuthorizeUrl } from "@/lib/linkedin";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.redirect(getLinkedInAuthorizeUrl());
}

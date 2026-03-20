import { NextResponse } from "next/server";
import { parseResumeFile } from "@/lib/resume-parser";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("resume");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Resume file is required" }, { status: 400 });
    }

    const text = await parseResumeFile(file);
    return NextResponse.json({ text });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to parse resume";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

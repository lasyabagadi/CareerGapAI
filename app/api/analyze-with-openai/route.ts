import { NextResponse } from "next/server";
import { generateDashboardWithOpenAI } from "@/lib/openai";
import { AnalyzeInput } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyzeInput;
    const dashboard = await generateDashboardWithOpenAI(body);
    return NextResponse.json(dashboard);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { generateDashboard } from "@/lib/analysis";

export async function POST(request: Request) {
  const body = (await request.json()) as Parameters<typeof generateDashboard>[0];
  const dashboard = generateDashboard(body);

  return NextResponse.json(dashboard);
}

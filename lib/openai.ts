import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { generateDashboard } from "@/lib/analysis";
import { AnalyzeInput, DashboardPayload, GapPriority } from "@/lib/types";

const learningPathStepSchema = z.object({
  title: z.string(),
  duration: z.string(),
  outcome: z.string()
});

const dashboardSchema = z.object({
  profile_summary: z.string(),
  strengths: z.array(z.string()).min(2).max(5),
  skill_gaps: z.array(
    z.object({
      skill: z.string(),
      priority: z.enum(["critical", "important", "nice-to-have"] satisfies [GapPriority, GapPriority, GapPriority]),
      reason: z.string(),
      recommended_actions: z.array(z.string()).min(1).max(3)
    })
  ),
  learning_paths: z.array(
    z.object({
      focus: z.string(),
      reason: z.string(),
      steps: z.array(learningPathStepSchema).min(1).max(4)
    })
  ),
  tailored_resume: z.object({
    target_role: z.string(),
    summary: z.string(),
    keywords_used: z.array(z.string()),
    sections: z.array(
      z.object({
        title: z.string(),
        bullets: z.array(z.string())
      })
    )
  })
});

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new OpenAI({ apiKey });
}

export async function generateDashboardWithOpenAI(input: AnalyzeInput): Promise<DashboardPayload> {
  const fallback = generateDashboard(input);
  const client = getClient();

  if (!client) {
    return fallback;
  }

  const response = await client.responses.parse({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text:
              "You are a career intelligence engine. Analyze the candidate profile and job description. Return honest, evidence-based skill gaps, a customized professional summary, learning paths, and a tailored resume draft. Do not invent employers or credentials."
          }
        ]
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: JSON.stringify(input, null, 2)
          }
        ]
      }
    ],
    text: {
      format: zodTextFormat(dashboardSchema, "career_gap_dashboard")
    }
  });

  const parsed = response.output_parsed;

  if (!parsed) {
    return fallback;
  }

  return {
    profile: input.profile,
    jobDescription: input.jobDescription,
    analysis: {
      ...fallback.analysis,
      strengths: parsed.strengths,
      skillGaps: parsed.skill_gaps.map((gap) => ({
        skill: gap.skill,
        priority: gap.priority,
        reason: gap.reason,
        recommendedActions: gap.recommended_actions
      })),
      learningPaths: parsed.learning_paths,
      tailoredResume: {
        targetRole: parsed.tailored_resume.target_role,
        summary: parsed.tailored_resume.summary,
        keywordsUsed: parsed.tailored_resume.keywords_used,
        sections: parsed.tailored_resume.sections
      }
    }
  };
}

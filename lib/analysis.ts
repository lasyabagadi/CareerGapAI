import { AnalyzeInput, DashboardPayload, ImportedProfile, MatchAnalysis, SkillGap } from "@/lib/types";
import { sampleDashboard } from "@/lib/sample-data";

const priorityWeight: Record<SkillGap["priority"], number> = {
  critical: 14,
  important: 8,
  "nice-to-have": 4
};

function extractList(text: string): string[] {
  return text
    .split(/\n|,|;|\./)
    .map((item) => item.trim())
    .filter((item) => item.length > 2);
}

function inferRole(jobDescription: string): { role: string; company: string } {
  const roleMatch = jobDescription.match(/Role:\s*(.+)/i);
  const companyMatch = jobDescription.match(/Company:\s*(.+)/i);

  return {
    role: roleMatch?.[1]?.trim() || "Target Role",
    company: companyMatch?.[1]?.trim() || "Dream Company"
  };
}

function mapSkillGap(skill: string): SkillGap {
  const normalized = skill.toLowerCase();

  if (normalized.includes("llm") || normalized.includes("openai") || normalized.includes("prompt")) {
    return {
      skill,
      priority: "critical",
      reason: "AI-assisted product work is central to the target role.",
      recommendedActions: [
        "Ship one prompt-driven feature with evaluation criteria.",
        "Track prompt quality with examples, scores, and user feedback."
      ]
    };
  }

  if (normalized.includes("postgres") || normalized.includes("sql")) {
    return {
      skill,
      priority: "important",
      reason: "The role expects stronger production-grade data handling.",
      recommendedActions: [
        "Design a relational schema for profiles, jobs, and resume versions.",
        "Practice advanced querying and migration workflows."
      ]
    };
  }

  if (normalized.includes("cloud") || normalized.includes("deployment")) {
    return {
      skill,
      priority: "important",
      reason: "Deployment experience increases confidence that you can ship beyond prototypes.",
      recommendedActions: [
        "Deploy one full-stack app with analytics and environment secrets.",
        "Document the production architecture and release checklist."
      ]
    };
  }

  return {
    skill,
    priority: "nice-to-have",
    reason: "This capability appears in the JD but is not yet strongly represented in the imported profile.",
    recommendedActions: [
      `Create one portfolio example that demonstrates ${skill}.`,
      `Add measurable outcomes for ${skill} in your resume and profile.`
    ]
  };
}

function computeSkillGaps(jobDescription: string, profile: ImportedProfile): SkillGap[] {
  const jdItems = extractList(jobDescription);
  const profileSkills = new Set(profile.skills.map((skill) => skill.toLowerCase()));
  const candidates = [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "SQL",
    "PostgreSQL",
    "OpenAI",
    "LLM evaluation",
    "Prompt design",
    "Cloud deployment",
    "Analytics instrumentation",
    "System design"
  ];

  return candidates
    .filter((candidate) => jdItems.some((item) => item.toLowerCase().includes(candidate.toLowerCase())))
    .filter((candidate) => !profileSkills.has(candidate.toLowerCase()))
    .map(mapSkillGap);
}

function computeStrengths(profile: ImportedProfile, role: string): string[] {
  return [
    `Your current portfolio already supports the ${role} narrative with product-minded web engineering work.`,
    `Imported signals from GitHub and LinkedIn create evidence-backed resume bullets instead of generic claims.`,
    "The combination of academic foundations and shipped projects positions you well for early-career technical roles."
  ];
}

function buildResume(profile: ImportedProfile, role: string, jobDescription: string) {
  const keywords = [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "SQL",
    "API integrations",
    "analytics",
    "AI features"
  ].filter((keyword) => jobDescription.toLowerCase().includes(keyword.toLowerCase()));

  return {
    targetRole: role,
    summary: `${profile.headline}. Tailored for ${role} with emphasis on shipped products, API integrations, and measurable learning velocity.`,
    keywordsUsed: keywords,
    sections: [
      {
        title: "Professional Summary",
        bullets: [profile.summary]
      },
      {
        title: "Projects & Evidence",
        bullets: profile.projects.map((project) => `${project}. Framed to highlight user impact, technical ownership, and job-relevant tools.`)
      },
      {
        title: "Skills Alignment",
        bullets: [
          `Current strengths: ${profile.skills.join(", ")}`,
          "Priority growth areas are surfaced in the dashboard so the resume stays honest while still role-aligned."
        ]
      }
    ]
  };
}

export function generateDashboard(payload?: Partial<AnalyzeInput>): DashboardPayload {
  if (!payload?.profile || !payload?.jobDescription) {
    return sampleDashboard;
  }

  const profile = payload.profile;
  const jobDescription = payload.jobDescription;
  const inferred = inferRole(jobDescription);
  const skillGaps = computeSkillGaps(jobDescription, profile);
  const totalPenalty = skillGaps.reduce((sum, gap) => sum + priorityWeight[gap.priority], 0);
  const score = Math.max(48, Math.min(96, 92 - totalPenalty));
  const analysis: MatchAnalysis = {
    targetRole: inferred.role,
    company: inferred.company,
    score,
    strengths: computeStrengths(profile, inferred.role),
    skillGaps,
    learningPaths:
      skillGaps.length > 0
        ? skillGaps.slice(0, 3).map((gap, index) => ({
            focus: gap.skill,
            reason: gap.reason,
            steps: [
              {
                title: `Learn the fundamentals of ${gap.skill}`,
                duration: `Week ${index + 1}`,
                outcome: `Build core understanding of ${gap.skill} with concise study notes.`
              },
              {
                title: `Create one portfolio proof-point for ${gap.skill}`,
                duration: `Week ${index + 2}`,
                outcome: "Turn learning into interview-ready evidence."
              },
              {
                title: `Reflect ${gap.skill} in resume and profile`,
                duration: `Week ${index + 3}`,
                outcome: "Keep the profile aligned with demonstrated growth."
              }
            ]
          }))
        : sampleDashboard.analysis.learningPaths,
    tailoredResume: buildResume(profile, inferred.role, jobDescription)
  };

  return {
    profile,
    jobDescription,
    analysis
  };
}

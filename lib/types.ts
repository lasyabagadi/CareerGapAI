export type ConnectedSource = "github" | "linkedin" | "manual";

export type ImportedProfile = {
  name: string;
  headline: string;
  location: string;
  summary: string;
  education: string[];
  experience: string[];
  projects: string[];
  certifications: string[];
  skills: string[];
  sourceSignals: Array<{
    source: ConnectedSource;
    signal: string;
  }>;
  linkedinUrl?: string;
  githubUsername?: string;
  email?: string;
  resumeText?: string;
};

export type GapPriority = "critical" | "important" | "nice-to-have";

export type SkillGap = {
  skill: string;
  priority: GapPriority;
  reason: string;
  recommendedActions: string[];
};

export type LearningPathStep = {
  title: string;
  duration: string;
  outcome: string;
};

export type LearningPath = {
  focus: string;
  reason: string;
  steps: LearningPathStep[];
};

export type ResumeSection = {
  title: string;
  bullets: string[];
};

export type TailoredResume = {
  targetRole: string;
  summary: string;
  keywordsUsed: string[];
  sections: ResumeSection[];
};

export type MatchAnalysis = {
  targetRole: string;
  company: string;
  score: number;
  strengths: string[];
  skillGaps: SkillGap[];
  learningPaths: LearningPath[];
  tailoredResume: TailoredResume;
};

export type DashboardPayload = {
  profile: ImportedProfile;
  jobDescription: string;
  analysis: MatchAnalysis;
};

export type AnalyzeInput = {
  profile: ImportedProfile;
  jobDescription: string;
};

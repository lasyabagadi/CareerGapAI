import { DashboardPayload } from "@/lib/types";

function section(title: string, lines: string[]) {
  return [title.toUpperCase(), ...lines, ""].join("\n");
}

function safeFilePart(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export function buildResumeDownloadText(payload: DashboardPayload) {
  const { profile, analysis } = payload;
  const header = [
    profile.name,
    profile.email || "",
    profile.location || "",
    profile.linkedinUrl || "",
    profile.githubUsername ? `GitHub: https://github.com/${profile.githubUsername}` : ""
  ].filter(Boolean);

  const sections = analysis.tailoredResume.sections.map((resumeSection) =>
    section(
      resumeSection.title,
      resumeSection.bullets.map((bullet) => `- ${bullet}`)
    )
  );

  return [
    ...header,
    "",
    `TARGET ROLE: ${analysis.tailoredResume.targetRole}`,
    "",
    section("Professional Summary", [analysis.tailoredResume.summary]),
    ...sections,
    section("Keywords", [analysis.tailoredResume.keywordsUsed.join(", ")]),
    section("Source Signals", payload.profile.sourceSignals.map((signal) => `- [${signal.source}] ${signal.signal}`))
  ].join("\n");
}

export function buildResumeFilename(payload: DashboardPayload) {
  const name = safeFilePart(payload.profile.name || "candidate");
  const role = safeFilePart(payload.analysis.tailoredResume.targetRole || "resume");
  return `${name}-${role}-resume.txt`;
}

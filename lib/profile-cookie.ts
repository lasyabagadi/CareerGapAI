import { cookies } from "next/headers";
import { ImportedProfile } from "@/lib/types";
import { sampleProfile } from "@/lib/sample-data";

const PROFILE_COOKIE = "career_gap_profile";

function sanitizeProfile(profile: ImportedProfile): ImportedProfile {
  return {
    ...profile,
    summary: profile.summary.slice(0, 400),
    experience: profile.experience.slice(0, 6).map((item) => item.slice(0, 180)),
    education: profile.education.slice(0, 4).map((item) => item.slice(0, 180)),
    projects: profile.projects.slice(0, 6).map((item) => item.slice(0, 200)),
    certifications: profile.certifications.slice(0, 6).map((item) => item.slice(0, 120)),
    skills: profile.skills.slice(0, 30).map((item) => item.slice(0, 40)),
    sourceSignals: profile.sourceSignals.slice(0, 12),
    resumeText: profile.resumeText?.slice(0, 1200)
  };
}

export async function readProfileCookie(): Promise<ImportedProfile> {
  const store = await cookies();
  const raw = store.get(PROFILE_COOKIE)?.value;

  if (!raw) {
    return sampleProfile;
  }

  try {
    return JSON.parse(raw) as ImportedProfile;
  } catch {
    return sampleProfile;
  }
}

export async function writeProfileCookie(profile: ImportedProfile) {
  const store = await cookies();
  store.set(PROFILE_COOKIE, JSON.stringify(sanitizeProfile(profile)), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export function mergeSignals(
  profile: ImportedProfile,
  signals: ImportedProfile["sourceSignals"]
): ImportedProfile["sourceSignals"] {
  const unique = new Map<string, ImportedProfile["sourceSignals"][number]>();

  [...profile.sourceSignals, ...signals].forEach((signal) => {
    unique.set(`${signal.source}:${signal.signal}`, signal);
  });

  return Array.from(unique.values());
}

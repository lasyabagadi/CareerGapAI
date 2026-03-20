import { ImportedProfile } from "@/lib/types";
import { mergeSignals } from "@/lib/profile-cookie";

type GitHubUser = {
  login: string;
  name: string | null;
  location: string | null;
  bio: string | null;
};

type GitHubRepo = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
};

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export function getGitHubAuthorizeUrl() {
  const clientId = requireEnv("GITHUB_CLIENT_ID");
  const redirectUri = requireEnv("GITHUB_REDIRECT_URI");
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "read:user user:email repo",
    allow_signup: "true"
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export async function exchangeGitHubCode(code: string) {
  const clientId = requireEnv("GITHUB_CLIENT_ID");
  const clientSecret = requireEnv("GITHUB_CLIENT_SECRET");

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code
    }),
    cache: "no-store"
  });

  const payload = (await response.json()) as { access_token?: string; error?: string };

  if (!response.ok || !payload.access_token) {
    throw new Error(payload.error || "GitHub token exchange failed");
  }

  return payload.access_token;
}

async function fetchGitHubUser(accessToken: string): Promise<GitHubUser> {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Unable to fetch GitHub user");
  }

  return (await response.json()) as GitHubUser;
}

async function fetchGitHubRepos(accessToken: string): Promise<GitHubRepo[]> {
  const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=8", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    return [];
  }

  return (await response.json()) as GitHubRepo[];
}

export async function importGitHubProfile(current: ImportedProfile, code: string): Promise<ImportedProfile> {
  const accessToken = await exchangeGitHubCode(code);
  const [user, repos] = await Promise.all([fetchGitHubUser(accessToken), fetchGitHubRepos(accessToken)]);
  const languages = Array.from(new Set(repos.map((repo) => repo.language).filter(Boolean))) as string[];
  const projectBullets = repos
    .filter((repo) => repo.description || repo.language)
    .slice(0, 4)
    .map((repo) => {
      const parts = [repo.name, repo.description, repo.language ? `Primary language: ${repo.language}` : "", repo.stargazers_count ? `${repo.stargazers_count} stars` : ""]
        .filter(Boolean)
        .join(" • ");

      return parts;
    });

  return {
    ...current,
    name: user.name || current.name,
    headline: current.headline || user.bio || current.headline,
    location: user.location || current.location,
    summary: user.bio || current.summary,
    githubUsername: user.login,
    skills: Array.from(new Set([...current.skills, ...languages])),
    projects: Array.from(new Set([...projectBullets, ...current.projects])),
    sourceSignals: mergeSignals(current, [
      { source: "github", signal: `Connected GitHub account @${user.login}` },
      { source: "github", signal: `${repos.length} repositories analyzed` },
      ...(languages.length > 0
        ? [{ source: "github" as const, signal: `Top languages: ${languages.join(", ")}` }]
        : [])
    ])
  };
}

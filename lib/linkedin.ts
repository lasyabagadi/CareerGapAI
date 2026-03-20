import { ImportedProfile } from "@/lib/types";
import { mergeSignals } from "@/lib/profile-cookie";

type LinkedInUserInfo = {
  sub?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email?: string;
  locale?: string;
};

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export function getLinkedInAuthorizeUrl() {
  const clientId = requireEnv("LINKEDIN_CLIENT_ID");
  const redirectUri = requireEnv("LINKEDIN_REDIRECT_URI");
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "openid profile email"
  });

  return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
}

async function exchangeLinkedInCode(code: string) {
  const clientId = requireEnv("LINKEDIN_CLIENT_ID");
  const clientSecret = requireEnv("LINKEDIN_CLIENT_SECRET");
  const redirectUri = requireEnv("LINKEDIN_REDIRECT_URI");
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri
  });

  const response = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store"
  });

  const payload = (await response.json()) as { access_token?: string; error_description?: string };

  if (!response.ok || !payload.access_token) {
    throw new Error(payload.error_description || "LinkedIn token exchange failed");
  }

  return payload.access_token;
}

async function fetchLinkedInUser(accessToken: string) {
  const response = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Unable to fetch LinkedIn user info");
  }

  return (await response.json()) as LinkedInUserInfo;
}

export async function importLinkedInProfile(current: ImportedProfile, code: string): Promise<ImportedProfile> {
  const accessToken = await exchangeLinkedInCode(code);
  const user = await fetchLinkedInUser(accessToken);

  return {
    ...current,
    name: user.name || `${user.given_name || ""} ${user.family_name || ""}`.trim() || current.name,
    email: user.email || current.email,
    sourceSignals: mergeSignals(current, [
      { source: "linkedin", signal: "LinkedIn OIDC sign-in connected" },
      { source: "linkedin", signal: "Profile basics imported from LinkedIn open permissions" }
    ])
  };
}

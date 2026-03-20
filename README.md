# CareerGap AI

Video Demo Link: https://youtu.be/Tcw95LkcCQo

CareerGap AI is a platform concept for students and early-career professionals who need a clearer path from their current profile to a target job role.

## What this build includes

- Landing page explaining the value proposition
- Dashboard flow for post-signup onboarding
- Real GitHub OAuth import
- Real LinkedIn OIDC sign-in
- Resume upload parsing for PDF, DOCX, and TXT
- OpenAI-powered job description analysis when `OPENAI_API_KEY` is configured
- Heuristic fallback analysis when no OpenAI key is present
- Skill-gap dashboard with priorities and recommended actions
- Learning path suggestions
- Customized resume draft aligned to the JD

## Product flow

1. User signs up and connects GitHub / LinkedIn or enters profile details manually.
2. User can also upload an existing resume so the platform learns missing context not visible in connected profiles.
3. Platform builds a structured candidate profile from projects, experience, education, skills, and resume evidence.
4. User pastes a target job description.
5. Analysis engine scores role fit, identifies missing skills, recommends a learning roadmap, and generates a tailored resume draft.

## Environment setup

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Required variables:

- `OPENAI_API_KEY` for AI-generated profile analysis and tailored resume output
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_REDIRECT_URI` for GitHub OAuth
- `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `LINKEDIN_REDIRECT_URI` for LinkedIn sign-in

Example local redirect URIs:

- `http://localhost:3000/api/auth/github/callback`
- `http://localhost:3000/api/auth/linkedin/callback`

## Local run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Notes on LinkedIn

This app uses LinkedIn's real OIDC sign-in flow with open permissions. In practice, LinkedIn exposes far less profile data to general apps than GitHub does, so the platform combines LinkedIn sign-in with resume upload and manual profile fields to build a richer candidate profile.


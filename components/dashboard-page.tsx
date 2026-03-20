"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import styles from "@/components/dashboard-page.module.css";
import { buildResumeDownloadText, buildResumeFilename } from "@/lib/resume-export";
import { sampleDashboard, sampleJobDescription } from "@/lib/sample-data";
import { DashboardPayload, ImportedProfile } from "@/lib/types";

type DashboardPageProps = {
  initialProfile?: ImportedProfile;
  initialDashboard?: DashboardPayload;
  statusMessage?: string;
  errorMessage?: string;
};

export function DashboardPage({
  initialProfile = sampleDashboard.profile,
  initialDashboard = sampleDashboard,
  statusMessage,
  errorMessage
}: DashboardPageProps) {
  const [profile, setProfile] = useState<ImportedProfile>(initialProfile);
  const [jobDescription, setJobDescription] = useState(sampleJobDescription);
  const [dashboard, setDashboard] = useState<DashboardPayload>(initialDashboard);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeMessage, setResumeMessage] = useState<string>();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await fetch("/api/profile/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });

      const response = await fetch("/api/analyze-with-openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, jobDescription })
      });

      if (!response.ok) {
        throw new Error("Failed to generate dashboard");
      }

      const payload = (await response.json()) as DashboardPayload;
      setDashboard(payload);
    } catch (error) {
      setResumeMessage(error instanceof Error ? error.message : "Something went wrong while generating the dashboard.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResumeUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsUploadingResume(true);
    setResumeMessage(undefined);

    try {
      if (file.size > 4 * 1024 * 1024) {
        throw new Error("Resume file is too large. Please keep it under 4 MB.");
      }

      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch("/api/resume/parse", {
        method: "POST",
        body: formData
      });

      const payload = (await response.json()) as { text?: string; error?: string };

      if (!response.ok || !payload.text) {
        throw new Error(payload.error || "Resume parsing failed");
      }

      setProfile((current) => ({
        ...current,
        resumeText: payload.text,
        sourceSignals: [...current.sourceSignals, { source: "manual", signal: `Resume uploaded: ${file.name}` }]
      }));
      setResumeMessage(`Parsed ${file.name} and added it to the AI profile context.`);
    } catch (error) {
      const extension = file.name.toLowerCase().split(".").pop();
      const fallbackAllowed = extension === "txt" || extension === "md";

      if (fallbackAllowed) {
        try {
          const text = (await file.text()).trim();

          if (!text) {
            throw new Error("The uploaded text file is empty.");
          }

          setProfile((current) => ({
            ...current,
            resumeText: text,
            sourceSignals: [...current.sourceSignals, { source: "manual", signal: `Resume uploaded: ${file.name}` }]
          }));
          setResumeMessage(`Loaded ${file.name} directly as text.`);
          return;
        } catch {
          setResumeMessage("We couldn't read that file. Please paste the resume text manually.");
          return;
        }
      }

      setResumeMessage(
        error instanceof Error
          ? `${error.message} If this keeps happening, paste the resume text into the box below.`
          : "Resume upload failed. Please paste the resume text manually."
      );
    } finally {
      setIsUploadingResume(false);
      event.target.value = "";
    }
  }

  function handleResumeDownload() {
    const resumeText = buildResumeDownloadText(dashboard);
    const blob = new Blob([resumeText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = buildResumeFilename(dashboard);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <main className={styles.page}>
      <div className="page-shell">
        <section className={styles.hero}>
          <div>
            <p className="pill">AI Career Command Center</p>
            <h1 className={styles.title}>Profile import, role matching, resume tailoring, and growth planning in one dashboard.</h1>
            <p className={styles.subtitle}>
              This MVP shows the core workflow after signup: connect LinkedIn/GitHub, add a job description, and get an
              evidence-backed profile plus an action-ready learning path.
            </p>
          </div>
          <div className={`${styles.heroStat} glass`}>
            <span>Target company</span>
            <strong>{dashboard.analysis.company}</strong>
            <small>{dashboard.analysis.targetRole}</small>
          </div>
        </section>

        <div className={styles.layout}>
          <form className={`${styles.formCard} glass`} onSubmit={handleSubmit}>
            <div className={styles.cardHeader}>
              <div>
                <p className={styles.eyebrow}>1. Signup & profile intake</p>
                <h2>Career identity</h2>
              </div>
              
            </div>

            

            <p className={styles.helper}>
              GitHub import is full OAuth-based. LinkedIn uses real OIDC sign-in and public open permissions, so the app
              combines that with your uploaded resume for deeper career details.
            </p>

            {statusMessage ? <p className={styles.success}>{statusMessage}</p> : null}
            {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

            <label>
              Full name
              <input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} />
            </label>
            <label>
              LinkedIn/GitHub powered headline
              <input
                value={profile.headline}
                onChange={(event) => setProfile({ ...profile, headline: event.target.value })}
              />
            </label>
            <label>
              Email
              <input
                value={profile.email || ""}
                onChange={(event) => setProfile({ ...profile, email: event.target.value })}
                placeholder="name@example.com"
              />
            </label>
            <label>
              LinkedIn profile URL
              <input
                value={profile.linkedinUrl || ""}
                onChange={(event) => setProfile({ ...profile, linkedinUrl: event.target.value })}
                placeholder="https://www.linkedin.com/in/your-profile"
              />
            </label>
            <label>
              Imported skill inventory
              <textarea
                rows={5}
                value={profile.skills.join(", ")}
                onChange={(event) =>
                  setProfile({
                    ...profile,
                    skills: event.target.value
                      .split(",")
                      .map((skill) => skill.trim())
                      .filter(Boolean)
                  })
                }
              />
            </label>
            <label>
              Projects and profile evidence
              <textarea
                rows={6}
                value={profile.projects.join("\n")}
                onChange={(event) =>
                  setProfile({
                    ...profile,
                    projects: event.target.value
                      .split("\n")
                      .map((project) => project.trim())
                      .filter(Boolean)
                  })
                }
              />
            </label>
            <label>
              Resume upload for richer AI context
              <input type="file" accept=".pdf,.docx,.txt" onChange={handleResumeUpload} />
            </label>
            <p className={styles.helper}>Supported formats: PDF, DOCX, TXT, and MD. Max size: 4 MB.</p>
            <label>
              Parsed resume context
              <textarea
                rows={8}
                value={profile.resumeText || ""}
                onChange={(event) => setProfile({ ...profile, resumeText: event.target.value })}
                placeholder="Paste your current resume here if you prefer not to upload a file."
              />
            </label>
            {resumeMessage ? <p className={styles.helper}>{resumeMessage}</p> : null}
            {isUploadingResume ? <p className={styles.helper}>Parsing resume...</p> : null}

            <div className={styles.cardHeader}>
              <div>
                <p className={styles.eyebrow}>2. JD ingestion</p>
                <h2>Dream role description</h2>
              </div>
            </div>
            <label>
              Paste job description
              <textarea rows={14} value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} />
            </label>

            <button className={styles.submit} type="submit" disabled={isLoading}>
              {isLoading ? "Analyzing profile..." : "Generate AI dashboard"}
            </button>
          </form>

          <section className={styles.results}>
            <div className={`${styles.scoreCard} glass`}>
              <div>
                <p className={styles.eyebrow}>Role match</p>
                <h2>{dashboard.analysis.targetRole}</h2>
                <p className={styles.meta}>{dashboard.analysis.company}</p>
              </div>
              <div className={styles.scoreBubble}>
                <strong>{dashboard.analysis.score}%</strong>
                <span>fit score</span>
              </div>
            </div>

            <div className={styles.grid}>
              <article className={`${styles.panel} glass`}>
                <h3>AI Profile Summary</h3>
                <p>{dashboard.analysis.tailoredResume.summary}</p>
                <div className={styles.keywordRow}>
                  {dashboard.analysis.tailoredResume.keywordsUsed.map((keyword) => (
                    <span key={keyword}>{keyword}</span>
                  ))}
                </div>
              </article>

              <article className={`${styles.panel} glass`}>
                <h3>Strength Signals</h3>
                <ul>
                  {dashboard.analysis.strengths.map((strength) => (
                    <li key={strength}>{strength}</li>
                  ))}
                </ul>
                <div className={styles.keywordRow}>
                  {profile.githubUsername ? <span>GitHub: @{profile.githubUsername}</span> : null}
                  {profile.linkedinUrl ? <span>LinkedIn URL added</span> : null}
                  {profile.resumeText ? <span>Resume context loaded</span> : null}
                </div>
              </article>
            </div>

            <article className={`${styles.panel} glass`}>
              <div className={styles.panelTitleRow}>
                <h3>Skill Gap Map</h3>
                <span>{dashboard.analysis.skillGaps.length} gaps found</span>
              </div>
              <div className={styles.gapGrid}>
                {dashboard.analysis.skillGaps.map((gap) => (
                  <section key={gap.skill} className={styles.gapCard}>
                    <div className={styles.gapHeader}>
                      <strong>{gap.skill}</strong>
                      <span data-priority={gap.priority}>{gap.priority}</span>
                    </div>
                    <p>{gap.reason}</p>
                    <ul>
                      {gap.recommendedActions.map((action) => (
                        <li key={action}>{action}</li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </article>

            <div className={styles.grid}>
              <article className={`${styles.panel} glass`}>
                <h3>Learning Path</h3>
                <div className={styles.pathList}>
                  {dashboard.analysis.learningPaths.map((path) => (
                    <div key={path.focus} className={styles.pathCard}>
                      <strong>{path.focus}</strong>
                      <p>{path.reason}</p>
                      <ol>
                        {path.steps.map((step) => (
                          <li key={step.title}>
                            <span>{step.duration}</span>
                            <p>{step.title}</p>
                            <small>{step.outcome}</small>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </article>

              <article className={`${styles.panel} glass`}>
                <div className={styles.resumeHeader}>
                  <h3>Customized Resume Draft</h3>
                  <button className={styles.downloadButton} type="button" onClick={handleResumeDownload}>
                    Download Resume
                  </button>
                </div>
                {dashboard.analysis.tailoredResume.sections.map((section) => (
                  <div key={section.title} className={styles.resumeSection}>
                    <h4>{section.title}</h4>
                    <ul>
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </article>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

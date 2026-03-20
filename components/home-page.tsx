"use client";

import Link from "next/link";
import styles from "@/components/home-page.module.css";

const features = [
  {
    title: "Career GPS",
    copy: "See exactly where your current skill graph falls short for a dream role, with a role-match score grounded in the job description."
  },
  {
    title: "AI Resume Builder",
    copy: "Transform your GitHub, LinkedIn, and project evidence into a tailored resume that mirrors the language and priorities of the JD."
  },
  {
    title: "Learning Dashboard",
    copy: "Get a focused learning path, high-priority skill gaps, and project ideas that make your next step obvious."
  }
];

const steps = [
  "Create an account and tell us your target roles.",
  "Connect GitHub or LinkedIn, or paste your current resume/profile details.",
  "Add a job description and generate a role-specific career dashboard in seconds."
];

export function HomePage() {
  return (
    <main className={styles.page}>
      <div className="page-shell">
        <header className={styles.header}>
          <div className="pill">CareerGap AI • Dream-role readiness engine</div>
          <nav className={styles.nav}>
            <a href="#features">Features</a>
            <a href="#workflow">Workflow</a>
            <Link href="/dashboard">Live Dashboard</Link>
          </nav>
        </header>

        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>Bridge the gap between classroom confidence and job-ready proof.</p>
            <h1 className={styles.title}>
              A career-gap platform that turns scattered profiles and job posts into one clear action plan.
            </h1>
            <p className={styles.subtitle}>
              Students and early-career professionals can connect GitHub and LinkedIn, analyze any job description,
              generate a tailored AI profile and resume, and see the exact skills to build next.
            </p>
            <div className={styles.ctaRow}>
              <Link className={styles.primaryCta} href="/dashboard">
                Open product demo
              </Link>
              <a className={styles.secondaryCta} href="#workflow">
                See how it works
              </a>
            </div>
          </div>

          <div className={`${styles.heroPanel} glass`}>
            <div className={styles.panelHeader}>
              <span>Role Fit Snapshot</span>
              <strong>78% match</strong>
            </div>
            <div className={styles.matchBar}>
              <span />
            </div>
            <div className={styles.metricGrid}>
              <article>
                <strong>3</strong>
                <span>critical growth areas</span>
              </article>
              <article>
                <strong>1</strong>
                <span>AI-tailored resume</span>
              </article>
              <article>
                <strong>2</strong>
                <span>portfolio-ready learning tracks</span>
              </article>
            </div>
          </div>
        </section>

        <section id="features" className={styles.featuresSection}>
          <div>
            <p className="pill">What the platform does</p>
            <h2 className="section-title">One profile, one job description, one roadmap.</h2>
            <p className="section-copy">
              Instead of making users jump between job boards, certification catalogs, GitHub repositories, and
              resume templates, the platform creates a single source of truth for career readiness.
            </p>
          </div>
          <div className={styles.featureGrid}>
            {features.map((feature) => (
              <article key={feature.title} className={`${styles.featureCard} glass`}>
                <h3>{feature.title}</h3>
                <p>{feature.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="workflow" className={styles.workflow}>
          <div className={`${styles.workflowCard} glass`}>
            <p className="pill">User Journey</p>
            <h2 className="section-title">From signup to skill roadmap</h2>
            <div className={styles.stepList}>
              {steps.map((step, index) => (
                <div key={step} className={styles.stepItem}>
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={`${styles.workflowCard} glass`}>
            <p className="pill">AI Outputs</p>
            <ul className={styles.outputList}>
              <li>Personalized professional summary aligned to the job description</li>
              <li>Skill-gap breakdown with critical, important, and nice-to-have priorities</li>
              <li>Project and certification suggestions to close each gap</li>
              <li>Role-specific resume bullets built from imported evidence</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}

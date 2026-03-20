import { DashboardPayload, ImportedProfile } from "@/lib/types";

export const sampleProfile: ImportedProfile = {
  name: "Siddhu Narayan",
  headline: "Aspiring full-stack engineer focused on product, data, and AI-powered workflows",
  location: "Bengaluru, India",
  summary:
    "Early-career engineer with strong academic fundamentals, hackathon experience, and a growing portfolio across web development, data pipelines, and automation.",
  education: [
    "B.Tech in Computer Science, expected 2026",
    "Coursework: Data Structures, DBMS, Operating Systems, Machine Learning"
  ],
  experience: [
    "Built internal student tooling for placement tracking and recruiter outreach.",
    "Collaborated on hackathon projects using React, Node.js, Firebase, and Python."
  ],
  projects: [
    "Job trend analyzer that clusters job descriptions and extracts common technical skills.",
    "Placement prep portal with resume review workflows and student analytics dashboard.",
    "GitHub activity summarizer that converts repository metadata into portfolio-ready project bullets."
  ],
  certifications: [
    "Google Data Analytics Foundations",
    "AWS Cloud Practitioner Essentials"
  ],
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "SQL",
    "Firebase",
    "Git",
    "REST APIs"
  ],
  sourceSignals: [
    { source: "github", signal: "18 repositories analyzed" },
    { source: "github", signal: "Top languages: TypeScript, Python, JavaScript" },
    { source: "linkedin", signal: "LinkedIn sign-in connected with public profile basics" },
    { source: "manual", signal: "Dream roles selected: Product Engineer, AI Engineer" }
  ],
  linkedinUrl: "https://www.linkedin.com/in/sample-user",
  githubUsername: "sample-user",
  email: "siddhu@example.com",
  resumeText:
    "Resume summary: early-career software engineer with projects in React, Next.js, Node.js, SQL, analytics dashboards, and AI-assisted workflows."
};

export const sampleJobDescription = `Role: Associate Software Engineer - AI Products
Company: NovaWorks

We are looking for an early-career engineer who can work across frontend and backend systems, collaborate closely with product teams, and ship AI-assisted user experiences. You should be comfortable with React, TypeScript, Node.js, SQL, API integrations, prompt design, LLM evaluation, and cloud deployment. Experience with GitHub workflows, analytics instrumentation, and resume or job-tech platforms is a plus.

Responsibilities:
- Build polished product features in React / Next.js
- Design backend services and integrate external APIs
- Translate customer needs into technical execution
- Measure feature adoption and iterate quickly
- Support AI feature experimentation and prompt refinement

Preferred skills:
- TypeScript, React, Next.js, Node.js, PostgreSQL
- OpenAI or LLM integration experience
- System design fundamentals
- Strong written communication`;

export const sampleDashboard: DashboardPayload = {
  profile: sampleProfile,
  jobDescription: sampleJobDescription,
  analysis: {
    targetRole: "Associate Software Engineer - AI Products",
    company: "NovaWorks",
    score: 78,
    strengths: [
      "Strong alignment on React, TypeScript, Next.js, Node.js, and API-based product work.",
      "Projects already show job-tech and dashboard thinking that map well to this role.",
      "Academic and hackathon experience suggest fast ramp-up potential in cross-functional execution."
    ],
    skillGaps: [
      {
        skill: "LLM evaluation",
        priority: "critical",
        reason: "The JD explicitly asks for AI experimentation and prompt refinement.",
        recommendedActions: [
          "Build a prompt testing harness with success metrics.",
          "Document before/after prompt iterations for one AI feature."
        ]
      },
      {
        skill: "PostgreSQL",
        priority: "important",
        reason: "The JD prefers SQL depth beyond general database familiarity.",
        recommendedActions: [
          "Ship one project with relational schema design and indexed queries.",
          "Practice joins, aggregations, and migrations in a production-style setup."
        ]
      },
      {
        skill: "Cloud deployment",
        priority: "important",
        reason: "Production-ready deployment is part of the expected engineering maturity.",
        recommendedActions: [
          "Deploy a full-stack app to Vercel or AWS with environment management.",
          "Add logging, analytics, and release notes to a live project."
        ]
      }
    ],
    learningPaths: [
      {
        focus: "AI Product Engineering",
        reason: "Best path to close the largest role-specific gaps quickly.",
        steps: [
          {
            title: "Build a JD-to-resume tailoring prototype with LLM prompts",
            duration: "Week 1",
            outcome: "Demonstrates prompt design and structured AI output generation."
          },
          {
            title: "Add evaluation metrics for summary quality and keyword coverage",
            duration: "Week 2",
            outcome: "Shows you can measure and improve AI-assisted features."
          },
          {
            title: "Ship the feature publicly with analytics instrumentation",
            duration: "Week 3",
            outcome: "Creates a portfolio artifact directly aligned with the job."
          }
        ]
      },
      {
        focus: "Production Backend Depth",
        reason: "Strengthens technical credibility for real-world engineering teams.",
        steps: [
          {
            title: "Model user, profile, and job entities in PostgreSQL",
            duration: "Week 1",
            outcome: "Demonstrates database design for product systems."
          },
          {
            title: "Create import pipelines for GitHub and LinkedIn data",
            duration: "Week 2",
            outcome: "Shows API integration and transformation skills."
          },
          {
            title: "Add deployment, monitoring, and release docs",
            duration: "Week 3",
            outcome: "Rounds out end-to-end software delivery."
          }
        ]
      }
    ],
    tailoredResume: {
      targetRole: "Associate Software Engineer - AI Products",
      summary:
        "Early-career full-stack engineer with hands-on experience building React and Next.js products, API-driven workflows, and data-informed dashboards. Brings strong foundations in TypeScript, Node.js, SQL, and product-focused problem solving, with a growing portfolio in AI-assisted features and job-tech tooling.",
      keywordsUsed: [
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "SQL",
        "API integrations",
        "analytics",
        "AI features"
      ],
      sections: [
        {
          title: "Selected Experience",
          bullets: [
            "Built placement and job-prep workflows that simplified recruiter tracking and student progress visibility.",
            "Collaborated on hackathon teams to ship web applications with React, Firebase, and Python-backed automation."
          ]
        },
        {
          title: "Relevant Projects",
          bullets: [
            "Developed a job trend analyzer that extracts recurring technical requirements from job descriptions and surfaces role-aligned skill clusters.",
            "Created a GitHub activity summarizer that converts repository and contribution data into resume-ready impact statements.",
            "Designed dashboard interfaces that connect student progress, skills evidence, and role readiness in one product experience."
          ]
        },
        {
          title: "Core Skills",
          bullets: [
            "TypeScript, React, Next.js, Node.js, Python, SQL, REST APIs, Firebase, Git, dashboard design",
            "Currently strengthening LLM prompt design, evaluation workflows, PostgreSQL, and cloud deployment"
          ]
        }
      ]
    }
  }
};

/**
 * Single source of truth for every word on the site.
 * Case studies live in ./projects.ts. Facts come from the public READMEs at github.com/aryanpol73.
 */

export * from "./projects";

export type ServiceId = "web-apps" | "ai-workflows" | "data-ml";

export interface Service {
  id: ServiceId;
  index: string;
  title: string;
  pitch: string;
  deliverables: string[];
  idealFor: string;
  timeline: string;
  proof: string[];
}

export interface ProcessStep {
  step: string;
  title: string;
  body: string;
  artifact: string;
}

export interface CapabilityGroup {
  domain: string;
  items: string[];
}

export interface Principle {
  title: string;
  body: string;
}

export const profile = {
  name: "Aryan Pol",
  initials: "AP",
  role: "Full-Stack & AI Engineer",
  location: "Pune, India · IST (UTC+5:30)",
  email: "aryanpol.dev@gmail.com",
  githubUser: "aryanpol73",
  githubUrl: "https://github.com/aryanpol73",
  linkedinUrl: "https://www.linkedin.com/in/aryanpol0305",
  /** Set to a Cal.com / Calendly link to open a scheduler. Empty → a pre-filled email request. */
  bookingUrl: "",
  availability: "Available for select freelance projects",
} as const;

export const hero = {
  headline: "Real-time web apps and AI systems, shipped to production — not just to a demo.",
  /** Words of the headline drawn in the animated gradient. Must appear in `headline` exactly. */
  highlight: "shipped to production",
  /** The terminal line typed once per visit before the availability pill appears. */
  bootLine: "whoami --status  →  available · IST (UTC+5:30)",
  /** Hero stats. `source` is shown on the ✓ so every number can be traced. */
  stats: [
    { k: "4.5K+", v: "users served live", source: "LBPL Cricket README · Season 3" },
    { k: "880+", v: "automated tests in 4 repos", source: "Strata 329 · CONFLUX 426 · P.O.W.E.R. 93 · Veract 38" },
    { k: "IST", v: "overlaps EU & US AM", source: "Pune, India · UTC+5:30" },
  ],
  subheadline:
    "My last production launch served 4,500+ users live through an entire cricket season, from a zero-install PWA. Every build ships with tests, CI, and written architecture decisions, so it keeps working after I hand it over.",
} as const;

/** About section, written from the November 2026 resume. */
export const about = {
  heading: "I build real products, and I get better at it every day.",
  bio: [
    "I'm a full-stack developer and a B.Tech student in Artificial Intelligence & Data Science at DY Patil College of Engineering, Pune. I build and ship real web apps and AI-powered products, not just coursework.",
    "My live-scoring app for the LBPL cricket tournament reached 4,500+ users, 600+ installs and 19,000+ page views in one season. Since then I've shipped a real-time collaboration platform, a fraud-detection dashboard, an orbital-debris risk tracker and an open-source developer tool.",
    "I take on freelance work in web development (React, Node.js) and AI-integrated applications. I like turning messy real-world problems into simple, working software, and I keep my fundamentals sharp with daily data structures and algorithms practice on LeetCode.",
  ],
  tags: ["Full-Stack Developer", "Pune, India · IST (UTC+5:30)", "Remote · clients worldwide"],
  education: {
    school: "DY Patil College of Engineering, Akurdi",
    degree: "B.Tech, Artificial Intelligence & Data Science",
    years: "2024 – 2028",
    detail: "CGPA 8.7 after semester 4",
  },
  leadership: [
    { role: "Management Co-lead", org: "Sambhav 3.0 TechFest", note: "Event and team coordination" },
    { role: "Technical Coordinator", org: "Toastmasters DYPCOE" },
    { role: "Coordinator", org: "Technical Championship" },
  ],
  interests: [
    "District-level cricket",
    "Badminton",
    "Table tennis",
    "Swimming",
    "Chess",
    "Portrait sketching",
    "Sudoku & puzzles",
    "Music",
  ],
} as const;

export const principles: Principle[] = [
  {
    title: "Async-First Clarity",
    body: "Written updates, decision records and a shared board. You never chase me for status, and nothing important lives only in a call.",
  },
  {
    title: "Weekly Working Demos",
    body: "Every week ends with a deployed preview URL you can click, not a slide. Scope drift shows up on day five, not week five.",
  },
  {
    title: "Clean Documentation & Handoff",
    body: "README, architecture notes, runbooks and a test suite in CI. Your team can extend it without me in the room.",
  },
];

export const services: Service[] = [
  {
    id: "web-apps",
    index: "01",
    title: "Production Web Apps & PWAs",
    pitch:
      "From idea to a launched, installable product your users rely on, with auth, roles, admin tools and real-time data built in from day one.",
    deliverables: [
      "Next.js or React app with a typed API",
      "Auth, roles and Postgres with row-level security",
      "Admin panel for your non-technical team",
      "Installable PWA with offline support",
      "CI pipeline, tests and production deploy",
    ],
    idealFor: "Founders validating an MVP, and communities or small businesses outgrowing WhatsApp and spreadsheets.",
    timeline: "3–6 weeks",
    proof: ["LBPL Cricket", "Strata", "FRAME"],
  },
  {
    id: "ai-workflows",
    index: "02",
    title: "AI Features & Agent Workflows",
    pitch:
      "LLM features that are grounded, structured and fail safely: agents that cite their sources, validate their output and keep working when the API doesn't.",
    deliverables: [
      "LLM integration with schema-validated output",
      "Multi-agent orchestration (LangGraph)",
      "AI moderation, triage or auto-reply flows",
      "MCP servers so your AI tools can use your data",
      "Fallback modes, guardrails and an eval harness",
    ],
    idealFor: "SaaS teams adding AI to an existing product, and ops teams automating review or triage work.",
    timeline: "2–5 weeks",
    proof: ["LBPL Cricket", "Veract", "Vocalyze"],
  },
  {
    id: "data-ml",
    index: "03",
    title: "Data, ML & Real-Time Dashboards",
    pitch:
      "Turn raw, messy data into scheduled pipelines, explainable models and live dashboards your team can trust and audit.",
    deliverables: [
      "Scheduled data pipelines (Actions, DuckDB, Parquet)",
      "Explainable models with honest, leakage-safe evals",
      "Live dashboards over WebSockets or SSE",
      "Model cards and decision records",
      "Low-cost hosting, often with no servers to run",
    ],
    idealFor: "Fintech, operations, logistics and research teams sitting on data they can't yet act on.",
    timeline: "3–8 weeks",
    proof: ["Perigee", "CONFLUX", "Continuum"],
  },
];

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Discovery",
    body: "A focused call and a short written questionnaire to pin down users, constraints and what success means in numbers.",
    artifact: "Problem brief",
  },
  {
    step: "02",
    title: "Architecture & Fixed Scope",
    body: "A written plan: stack, data model, milestones and what's explicitly out of scope, with a fixed price and timeline you approve.",
    artifact: "Scope doc + quote",
  },
  {
    step: "03",
    title: "Weekly Live Demos",
    body: "Every week ends with a deployed preview link and a two-minute async update. You steer early, while changes are cheap.",
    artifact: "Preview URL each week",
  },
  {
    step: "04",
    title: "Production Handoff",
    body: "Production deploy, CI, docs and a recorded walkthrough, plus two weeks of post-launch fixes included.",
    artifact: "Repo, runbook, walkthrough",
  },
];

export const capabilities: CapabilityGroup[] = [
  {
    domain: "Frontend & UI",
    items: [
      "TypeScript",
      "React 19",
      "Next.js 15",
      "Vite",
      "Tailwind CSS",
      "Framer Motion",
      "Zustand",
      "TanStack Query",
      "CesiumJS",
      "PWA / Service Workers",
      "Playwright",
      "axe a11y",
    ],
  },
  {
    domain: "Backend & APIs",
    items: [
      "Node.js",
      "Express 5",
      "FastAPI",
      "Socket.IO",
      "WebSockets / SSE",
      "PostgreSQL",
      "Supabase",
      "MongoDB",
      "Redis + BullMQ",
      "Yjs CRDTs",
      "Zod",
      "WebAuthn passkeys",
    ],
  },
  {
    domain: "AI, Data & ML",
    items: [
      "Gemini API",
      "LangGraph",
      "Pydantic schemas",
      "MCP servers",
      "LightGBM",
      "XGBoost",
      "scikit-learn",
      "pandas / NumPy / SciPy",
      "DuckDB + Parquet",
      "TimescaleDB / PostGIS",
      "Pyodide (WASM)",
    ],
  },
  {
    domain: "Cloud & DevOps",
    items: [
      "GitHub Actions",
      "Docker",
      "Vercel",
      "Render",
      "Cloudflare Pages",
      "Supabase Edge Functions",
      "Cloudinary",
      "Hugging Face Datasets",
    ],
  },
];

export const budgetRanges = ["<$1k", "$1k–$3k", "$3k–$7k", "$7k+"] as const;
export type BudgetRange = (typeof budgetRanges)[number];

export const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
] as const;

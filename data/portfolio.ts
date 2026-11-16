/**
 * Single source of truth for every word on the site.
 * All project facts below are taken from the public READMEs at github.com/aryanpol73.
 */

export type ProjectVisualKind = "scoreboard" | "branches" | "orbit" | "graph";

export interface Metric {
  value: string;
  label: string;
}

export interface Project {
  slug: string;
  name: string;
  category: string;
  year: string;
  tagline: string;
  summary: string;
  metrics: Metric[];
  problem: string;
  architecture: { title: string; detail: string }[];
  outcomes: string[];
  stack: string[];
  sourceUrl: string;
  liveUrl: string | null;
  liveNote?: string;
  visual: ProjectVisualKind;
}

export interface MoreBuild {
  name: string;
  kind: string;
  line: string;
  sourceUrl: string;
  liveUrl: string | null;
}

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
  subheadline:
    "My last production launch served 4,500+ users live through an entire cricket season, from a zero-install PWA. Every build ships with tests, CI, and written architecture decisions, so it keeps working after I hand it over.",
} as const;

export const bio = [
  "I'm a full-stack and AI engineer in Pune (B.Tech, AI & Data Science) who builds every project as if it's going to production — because mine usually do.",
  "I work async-first: decisions, test plans and honest limitations are written down in the repo, and you get short weekly updates you can read in two minutes.",
  "I own the outcome end to end, from the first schema to the deploy pipeline to the handoff notes your next engineer will rely on.",
] as const;

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

export const projects: Project[] = [
  {
    slug: "lbpl-cricket",
    name: "LBPL Cricket",
    category: "Production PWA · Real-time",
    year: "2026",
    tagline: "The official live-scoring platform for an 18-team, 33-match tournament.",
    summary:
      "Replaced forwarded WhatsApp scores with one verified, installable source of truth: live scores, AI win probability, points tables and a moderated fan community.",
    metrics: [
      { value: "4.5K+", label: "users in Season 3" },
      { value: "19K+", label: "page views" },
      { value: "600+", label: "app installs" },
    ],
    problem:
      "Scores and standings for the LBPL tournament travelled through forwarded WhatsApp messages and word of mouth, so they were often late or simply wrong. Organizers needed one source of truth that fans could install without an app store, that stayed usable on patchy match-ground internet, and that a small volunteer team could run during live matches.",
    architecture: [
      {
        title: "Installable PWA instead of native apps",
        detail:
          "React 18 + Vite SPA with a service-worker cache. It installs on Android, iPhone and desktop, uses almost no storage, and skips app-store review entirely.",
      },
      {
        title: "Supabase as the whole backend",
        detail:
          "Postgres with Row Level Security and 39 versioned migrations, Realtime subscriptions for scores, polls and the community feed, and role-based admin checked server-side with a has_role() SQL function.",
      },
      {
        title: "AI where it saves organizer time",
        detail:
          "Deno Edge Functions call Gemini 2.5 Flash for a live win-probability bar and to moderate every community post before it goes live, blocking abuse and spam automatically.",
      },
      {
        title: "Integrity in the database, not the UI",
        detail:
          "One vote per user is a database constraint, poll results come from SQL aggregate functions, and triggers keep points-table names in sync when a team is edited.",
      },
    ],
    outcomes: [
      "Ran in production for the whole of Season 3: 4,500+ users, 19,000+ page views and 600+ installs.",
      "Scores reached fans in real time from one admin panel, ending the WhatsApp-forward lag and errors.",
      "Passwordless email-OTP login kept fan sign-up to a single step.",
      "Config-driven seasons: adding a new season is one object in a config file, with no UI changes.",
    ],
    stack: [
      "React 18",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "TanStack Query",
      "Supabase",
      "PostgreSQL + RLS",
      "Edge Functions",
      "Gemini 2.5 Flash",
      "PWA",
    ],
    sourceUrl: "https://github.com/aryanpol73/LBPLCricket",
    liveUrl: "https://lbplofficial.com",
    visual: "scoreboard",
  },
  {
    slug: "strata",
    name: "Strata",
    category: "Real-time SaaS · Collaboration",
    year: "2026",
    tagline: "Team messaging where decisions outlast the chat they came from.",
    summary:
      "Branch a side topic away and merge back one resolution, edit checklists together live, and file settled decisions on a Canvas that links back to where they were said.",
    metrics: [
      { value: "329", label: "automated tests" },
      { value: "E2EE", label: "encrypted messages" },
      { value: "AA", label: "WCAG 2.1 audited" },
    ],
    problem:
      "Chat is the fastest way for a group to reach a decision and one of the worst places to keep it. Useful answers scroll away, side topics hijack the main thread, and plans copied into separate documents drift out of sync. Teams needed the speed of chat without losing what was decided.",
    architecture: [
      {
        title: "Shared contracts across the stack",
        detail:
          "Strict TypeScript everywhere, with Zod schemas in a shared package that validate both the Express 5 API and the React 19 client from one definition.",
      },
      {
        title: "Horizontally scalable real-time",
        detail:
          "Socket.IO with the Redis adapter, so events reach users connected to any server node. Multi-node behaviour is tested with a second server process.",
      },
      {
        title: "CRDTs with server-side rules",
        detail:
          "Live checklists and rosters are Yjs documents. The server validates each update instead of blindly relaying it, which is what makes rules like 'you can only sign yourself up' enforceable.",
      },
      {
        title: "Offline and private by default",
        detail:
          "Messages are end-to-end encrypted on the device. Dexie/IndexedDB caches conversations and a durable outbox sends queued messages on reconnect. Argon2 and rotating refresh tokens protect accounts.",
      },
    ],
    outcomes: [
      "329 automated tests: 228 server tests against real MongoDB, Redis and Socket.IO clients, plus 72 real-browser Playwright tests.",
      "The browser suite runs on the production build and fails on any page error or Content-Security-Policy violation.",
      "axe accessibility audits pass WCAG 2.1 AA in all four themes.",
      "Every change is tested and the Docker image built in GitHub Actions before merge, then deployed to staging on Render.",
    ],
    stack: [
      "TypeScript",
      "React 19",
      "Express 5",
      "Socket.IO",
      "Redis + BullMQ",
      "Yjs CRDTs",
      "MongoDB",
      "Zod",
      "Dexie / IndexedDB",
      "Playwright",
      "Docker",
    ],
    sourceUrl: "https://github.com/aryanpol73/strata",
    liveUrl: "https://strata-0k8v.onrender.com",
    liveNote: "Staging on a free plan: the first load can take about a minute to wake.",
    visual: "branches",
  },
  {
    slug: "perigee",
    name: "Perigee",
    category: "Data Platform · ML · 3D",
    year: "2026",
    tagline: "Orbital-debris risk for ~20,000 tracked objects, computed daily and rendered in the browser.",
    summary:
      "A live 3D globe, a week of estimated close approaches, an ML risk index, crowding by altitude and an in-browser breakup simulator, all from public data.",
    metrics: [
      { value: "0.70", label: "PR-AUC vs 0.39 baseline" },
      { value: "~20K", label: "objects tracked" },
      { value: "$0", label: "production servers" },
    ],
    problem:
      "Collision-risk analysis normally sits behind specialist tooling, and public orbit data is noisy (about a kilometre of error, no covariance), so naive screening floods users with false alarms. The goal was an honest, explorable view of orbital risk that anyone could open in a browser.",
    architecture: [
      {
        title: "Serverless by design",
        detail:
          "A daily GitHub Actions job screens the whole catalog, scores it and publishes static data files to Cloudflare Pages. There is no server to run, patch or pay for in production.",
      },
      {
        title: "Fast, exact screening",
        detail:
          "A SciPy KD-tree sieve finds candidate pairs within 5 km over 7 days, then each is refined to its time of closest approach.",
      },
      {
        title: "ML that knows its limits",
        detail:
          "A LightGBM model trained on a year of Space-Track history with a strict time split estimates which approaches stay close once newer data arrives, documented in a model card.",
      },
      {
        title: "Heavy compute in the browser",
        detail:
          "SGP4 propagation runs in Web Workers for a CesiumJS globe, and the breakup simulator is Python compiled to WebAssembly with Pyodide.",
      },
    ],
    outcomes: [
      "Finds 100% of CelesTrak SOCRATES's close approaches on identical inputs.",
      "The ML risk index reaches a test PR-AUC of 0.70, against 0.39 for the best baseline.",
      "Self-hosted API reads at p95 71 ms with 20 concurrent clients.",
      "CI on every push with an 80% coverage gate, browser tests on the production build, a watchdog and one-click rollback. Also ships as a PWA and Android APK.",
    ],
    stack: [
      "Python 3.12",
      "FastAPI",
      "LightGBM",
      "DuckDB + Parquet",
      "SciPy",
      "React",
      "TypeScript",
      "CesiumJS",
      "Pyodide (WASM)",
      "GitHub Actions",
      "Cloudflare Pages",
    ],
    sourceUrl: "https://github.com/aryanpol73/perigee",
    liveUrl: "https://perigee-space.pages.dev",
    visual: "orbit",
  },
  {
    slug: "conflux",
    name: "CONFLUX",
    category: "Fintech · Fraud Detection",
    year: "2026",
    tagline: "Finds card-testing fraud rings by their shape, not one transaction at a time.",
    summary:
      "Builds a temporal entity graph over shared cards, devices and IPs, scores candidate campaigns with an explainable percentile scorer, and streams them to a live dashboard.",
    metrics: [
      { value: "426", label: "tests passing" },
      { value: "45", label: "campaigns surfaced" },
      { value: "6", label: "explainable signals" },
    ],
    problem:
      "Fraud rings don't look suspicious one transaction at a time, so row-level scoring misses coordinated card-testing campaigns. And a black-box score an analyst can't explain is a score they can't act on or defend.",
    architecture: [
      {
        title: "Temporal entity graph",
        detail:
          "Transactions become nodes; shared cards, devices, IPs and merchants become time-aware edges that respect observation windows, so the graph can never see into the future.",
      },
      {
        title: "Deterministic, auditable scoring first",
        detail:
          "Six decorrelated features are mapped to percentiles against a frozen reference distribution and averaged. Any ML challenger has to beat it on grouped, out-of-fold PR-AUC before it ships.",
      },
      {
        title: "Explanations generated from the math",
        detail:
          "The explainability layer inverts each contribution to its exact percentile and renders a plain-English verdict, e.g. 'tighter than 97% of comparable groups'.",
      },
      {
        title: "Leakage made structurally impossible",
        detail:
          "The FastAPI ingest rejects ground-truth fields with HTTP 422. A TypeScript dashboard on Vercel receives campaigns live over WebSockets from the API on Render.",
      },
    ],
    outcomes: [
      "From 4,372 candidates formed without touching labels, surfaced 81 genuine positives across 45 distinct campaigns at a 1.85% base rate.",
      "Every risk score arrives with linking entities, a contribution breakdown and a human-readable explanation.",
      "426 tests passing, including tests that encode design commitments such as no label leakage.",
      "Each build phase was gated on its own checklist before the next began.",
    ],
    stack: ["Python", "FastAPI", "pandas", "XGBoost", "WebSockets", "TypeScript", "Vite", "Render", "Vercel"],
    sourceUrl: "https://github.com/aryanpol73/conflux",
    liveUrl: "https://conflux-drab.vercel.app",
    visual: "graph",
  },
];

export const moreBuilds: MoreBuild[] = [
  {
    name: "Fence",
    kind: "Developer tooling",
    line: "Traces code back to the commits, PRs and issues that explain it, and warns before a change deletes code that exists for a reason. CLI, git hook, GitHub Action and MCP server.",
    sourceUrl: "https://github.com/aryanpol73/fence",
    liveUrl: null,
  },
  {
    name: "QUORUM",
    kind: "Multi-agent AI",
    line: "Seven LangGraph agents research an NSE stock in parallel, debate with cited evidence, and reach a risk-checked decision, streamed token by token.",
    sourceUrl: "https://github.com/aryanpol73/quorum",
    liveUrl: "https://quorum-silk-three.vercel.app",
  },
  {
    name: "FRAME",
    kind: "Next.js 15 · CMS",
    line: "Editorial photography journal with a passkey-protected studio, EXIF auto-fill, AI captions and an installable PWA.",
    sourceUrl: "https://github.com/aryanpol73/FRAME",
    liveUrl: "https://frame-aryan-on-cam.vercel.app",
  },
  {
    name: "P.O.W.E.R.",
    kind: "Forecasting · ML",
    line: "Forecasts EV charging demand 1–24 hours ahead and warns before transformers overload, with explained forecasts and 93 passing tests.",
    sourceUrl: "https://github.com/aryanpol73/P.O.W.E.R",
    liveUrl: null,
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
    proof: ["QUORUM", "LBPL Cricket", "Fence"],
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
    proof: ["Perigee", "CONFLUX", "P.O.W.E.R."],
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

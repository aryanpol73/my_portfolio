/**
 * Case studies. Every fact comes from the public README of the linked repository.
 * Screenshots live in /public/projects and were captured from each project's own home page.
 */

export type ProjectGroup = "web" | "ai" | "data" | "tools";

export const projectGroups: { id: ProjectGroup | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "web", label: "Web & PWAs" },
  { id: "ai", label: "AI & Agents" },
  { id: "data", label: "Data & ML" },
  { id: "tools", label: "Dev Tools" },
];

export interface Metric {
  value: string;
  label: string;
}

export interface Project {
  slug: string;
  name: string;
  group: ProjectGroup;
  category: string;
  year: string;
  featured?: boolean;
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
  /** Button text for liveUrl. Defaults to "Live Demo". */
  liveLabel?: string;
  /** Path under /public. */
  image: string;
  /** Address shown in the screenshot's browser bar. */
  imageUrlLabel: string;
  /** Shown under the screenshot when it was not taken from a public deployment. */
  imageNote?: string;
}

export const projects: Project[] = [
  {
    slug: "lbpl-cricket",
    name: "LBPL Cricket",
    group: "web",
    category: "Production PWA · Real-time",
    year: "2026",
    featured: true,
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
    stack: ["React 18", "TypeScript", "Vite", "Tailwind CSS", "TanStack Query", "Supabase", "PostgreSQL + RLS", "Edge Functions", "Gemini 2.5 Flash", "PWA"],
    sourceUrl: "https://github.com/aryanpol73/LBPLCricket",
    liveUrl: "https://lbplofficial.com",
    image: "/projects/lbpl.png",
    imageUrlLabel: "lbplofficial.com",
  },
  {
    slug: "perigee",
    name: "Perigee",
    group: "data",
    category: "Data Platform · ML · 3D",
    year: "2026",
    featured: true,
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
        detail: "A SciPy KD-tree sieve finds candidate pairs within 5 km over 7 days, then each is refined to its time of closest approach.",
      },
      {
        title: "ML that knows its limits",
        detail:
          "A LightGBM model trained on a year of Space-Track history with a strict time split estimates which approaches stay close once newer data arrives, documented in a model card.",
      },
      {
        title: "Heavy compute in the browser",
        detail: "SGP4 propagation runs in Web Workers for a CesiumJS globe, and the breakup simulator is Python compiled to WebAssembly with Pyodide.",
      },
    ],
    outcomes: [
      "Finds 100% of CelesTrak SOCRATES's close approaches on identical inputs.",
      "The ML risk index reaches a test PR-AUC of 0.70, against 0.39 for the best baseline.",
      "Self-hosted API reads at p95 71 ms with 20 concurrent clients.",
      "CI on every push with an 80% coverage gate, browser tests on the production build, a watchdog and one-click rollback. Also ships as a PWA and Android APK.",
    ],
    stack: ["Python 3.12", "FastAPI", "LightGBM", "DuckDB + Parquet", "SciPy", "React", "TypeScript", "CesiumJS", "Pyodide (WASM)", "GitHub Actions", "Cloudflare Pages"],
    sourceUrl: "https://github.com/aryanpol73/perigee",
    liveUrl: "https://perigee-space.pages.dev",
    image: "/projects/perigee.png",
    imageUrlLabel: "perigee-space.pages.dev",
  },
  {
    slug: "strata",
    name: "Strata",
    group: "web",
    category: "Real-time SaaS · Collaboration",
    year: "2026",
    featured: true,
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
        detail: "Strict TypeScript everywhere, with Zod schemas in a shared package that validate both the Express 5 API and the React 19 client from one definition.",
      },
      {
        title: "Horizontally scalable real-time",
        detail: "Socket.IO with the Redis adapter, so events reach users connected to any server node. Multi-node behaviour is tested with a second server process.",
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
    stack: ["TypeScript", "React 19", "Express 5", "Socket.IO", "Redis + BullMQ", "Yjs CRDTs", "MongoDB", "Zod", "Dexie / IndexedDB", "Playwright", "Docker"],
    sourceUrl: "https://github.com/aryanpol73/strata",
    liveUrl: "https://strata-0k8v.onrender.com",
    liveNote: "Staging on a free plan: the first load can take about a minute to wake.",
    image: "/projects/strata.png",
    imageUrlLabel: "strata-0k8v.onrender.com",
  },
  {
    slug: "conflux",
    name: "CONFLUX",
    group: "data",
    category: "Fintech · Fraud Detection",
    year: "2026",
    featured: true,
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
        detail: "The explainability layer inverts each contribution to its exact percentile and renders a plain-English verdict, e.g. 'tighter than 97% of comparable groups'.",
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
    image: "/projects/conflux-graph.png",
    imageUrlLabel: "conflux-drab.vercel.app",
  },
  {
    slug: "quorum",
    name: "QUORUM",
    group: "ai",
    category: "Multi-agent AI · Finance",
    year: "2026",
    tagline: "Seven AI agents research an NSE stock, debate with cited evidence, and reach a group decision.",
    summary:
      "A LangGraph trading floor: three analysts gather data in parallel, a Bull and a Bear argue over an evidence ledger, a risk manager reflects, and a portfolio manager places a paper trade.",
    metrics: [
      { value: "7", label: "cooperating agents" },
      { value: "9", label: "graph nodes" },
      { value: "SSE", label: "token-by-token reasoning" },
    ],
    problem:
      "Single-prompt LLM 'stock picks' are unverifiable: they invent numbers, ignore the other side of the argument, and fail silently when an API goes down. The project set out to show what a grounded, inspectable, failure-tolerant agent system looks like.",
    architecture: [
      {
        title: "LangGraph StateGraph with parallel fan-out",
        detail: "Market, News and Fundamentals agents run at the same time from START, then fan in to an evidence board over a typed shared state.",
      },
      {
        title: "Grounding through a citable ledger",
        detail:
          "Every fact gets an ID (T1, N0, F1). Debaters must cite IDs, which are parsed and validated; the risk manager flags made-up IDs, uncited claims and figures absent from the ledger.",
      },
      {
        title: "Structured output with self-repair",
        detail: "Pydantic schemas are passed to Gemini as response_schema; invalid JSON is retried once with the validation error fed back.",
      },
      {
        title: "Designed to never break a demo",
        detail: "15-minute TTL cache, LLM timeout plus retry, a circuit breaker, an offline rule-based engine and a DEMO_MODE dataset keep it working with no network or key.",
      },
    ],
    outcomes: [
      "Every agent's reasoning streams live over Server-Sent Events, so nothing happens off-screen.",
      "Volatility-scaled position cap (0–20%) and no short selling enforced after validation.",
      "Evaluation page scores decisions against buy & hold, an RSI rule and random, using only dates after the model's knowledge cutoff.",
      "SQLite memory: the portfolio manager is shown its last three decisions on a ticker.",
    ],
    stack: ["LangGraph", "Gemini (google-genai)", "Pydantic", "FastAPI", "SSE", "SQLModel", "React", "TypeScript", "Vite", "lightweight-charts", "Framer Motion"],
    sourceUrl: "https://github.com/aryanpol73/quorum",
    liveUrl: "https://quorum-silk-three.vercel.app",
    image: "/projects/quorum.png",
    imageUrlLabel: "localhost · demo mode",
    imageNote: "Captured from a local run in DEMO_MODE with the offline engine.",
  },
  {
    slug: "veract",
    name: "Veract",
    group: "ai",
    category: "AI Settlement · Cryptography",
    year: "2026",
    tagline: "Zero-trust verification between AI agents and payment rails, so buyers never pay for hallucinated work.",
    summary:
      "Every AI-produced invoice passes a deterministic 3-gate check, gets a signed receipt, and is anchored in a Merkle tree, with PayPal escrow capturing only verified work.",
    metrics: [
      { value: "38/38", label: "tests passing" },
      { value: "<5 ms", label: "tamper self-heal" },
      { value: "O(log N)", label: "inclusion proofs" },
    ],
    problem:
      "Autonomous agents extract totals and clauses from contracts at scale, but they hallucinate cents, invent clauses and are vulnerable to Unicode homograph tricks. Meanwhile ordinary audit logs can be silently edited after settlement. Payments need proof, not trust.",
    architecture: [
      {
        title: "3-gate deterministic verification",
        detail: "Gate 1 validates structure with Zod, Gate 2 grounds every quoted span against the source contract after NFKC normalization, Gate 3 checks exact integer-cent arithmetic.",
      },
      {
        title: "Canonical, constant-time attestation",
        detail: "RFC 8785 canonical JSON removes key-order nondeterminism before SHA-256 hashing; receipts are HMAC-signed and compared with crypto.timingSafeEqual.",
      },
      {
        title: "Merkle anchoring with portable proofs",
        detail: "Receipts are batched into an epoch Merkle root; auditors verify a single transaction offline from a .veract.json certificate without seeing the rest of the ledger.",
      },
      {
        title: "Outcome-metered PayPal escrow",
        detail: "A pre-authorized ceiling is captured only for tasks that pass all gates; the rest is released back to the buyer automatically.",
      },
    ],
    outcomes: [
      "38 unit tests across 5 cryptographic and state suites, all passing.",
      "An autonomous sentinel detects mutated payloads against signed roots and restores them from snapshot in under 5 ms.",
      "Demo run: $10 pre-authorized, 3 of 5 tasks verified, $6 captured and $4 returned instantly.",
    ],
    stack: ["TypeScript", "React", "Vite", "Express", "Zod", "SHA-256 / HMAC", "Merkle trees", "PayPal Orders v2", "Gemini 2.5 Flash", "Vitest"],
    sourceUrl: "https://github.com/aryanpol73/veract",
    liveUrl: null,
    image: "/projects/veract.png",
    imageUrlLabel: "localhost · seeded fixtures",
    imageNote: "Captured from a local run with the repo's seeded fixtures.",
  },
  {
    slug: "continuum",
    name: "Continuum",
    group: "data",
    category: "HealthTech · Clinical Workflow",
    year: "2026",
    tagline: "Finds chronic-care patients whose medicine ran out before their next appointment.",
    summary:
      "Turns messy clinic exports into a priority worklist for care coordinators, with WhatsApp click-to-chat outreach in English, Hindi and Marathi and strict consent rules.",
    metrics: [
      { value: "137", label: "overdue cases detected" },
      { value: "47", label: "hidden refill gaps" },
      { value: "100%", label: "consent-gate compliance" },
    ],
    problem:
      "In busy Indian outpatient clinics, diabetic patients lapse when prescriptions run out weeks before their next scheduled review. Appointment calendars show nothing overdue, so these 'refill-only gaps' stay invisible until the patient returns sicker.",
    architecture: [
      {
        title: "Robust ingestion of real clinic exports",
        detail: "Normalizes Indian phone numbers for wa.me links and mixed date formats, and flags duplicate UHIDs plus fuzzy name/phone/age matches.",
      },
      {
        title: "Earliest-exhausting drug engine",
        detail: "Parses real dosing patterns (1-0-1, 1/2-0-1/2, BD, TDS…) and computes which medicine on each prescription runs out first.",
      },
      {
        title: "Episodes with a clear state machine",
        detail: "Separates the reason (follow-up overdue, refill gap, combined) from workflow status (detected → contacted → promised → returned), ranked purely by days overdue.",
      },
      {
        title: "Medico-legal safeguards",
        detail: "Kin escalation is hard-blocked without recorded consent, message templates never improvise medical advice, and every action lands in an immutable audit log.",
      },
    ],
    outcomes: [
      "Scored against a calibrated synthetic answer key: 137 overdue cases, including 47 refill-only gaps that appointment logic misses.",
      "100% exact day-count parity and 100% consent-gate compliance in the scoring harness.",
      "Multi-page Streamlit console with KPIs, a time-travel date control, patient timelines and a prescription OCR workbench.",
    ],
    stack: ["Python", "Streamlit", "SQLAlchemy", "pandas", "Pydantic", "Gemini (vision OCR)", "pytest", "WhatsApp click-to-chat"],
    sourceUrl: "https://github.com/aryanpol73/continuum",
    liveUrl: null,
    image: "/projects/continuum.png",
    imageUrlLabel: "localhost · synthetic clinic data",
    imageNote: "Captured from a local run on the repo's synthetic clinic dataset.",
  },
  {
    slug: "frame",
    name: "FRAME",
    group: "web",
    category: "Next.js 15 · Headless CMS",
    year: "2026",
    tagline: "An editorial photography journal with a private, passkey-protected studio behind it.",
    summary:
      "Visitors get a quiet, magazine-style site; the owner gets a studio to publish from a phone with EXIF auto-fill and AI captions, with no commits or redeploys.",
    metrics: [
      { value: "Passkeys", label: "WebAuthn sign-in" },
      { value: "0", label: "commits to publish" },
      { value: "PWA", label: "installable, offline-tolerant" },
    ],
    problem:
      "Portfolio sites either look generic or force the owner to edit code and redeploy for every new photo. The goal was an image-led site with real editorial rhythm, plus a content system a non-developer could run from a phone.",
    architecture: [
      {
        title: "Next.js 15 App Router end to end",
        detail: "Server Components, Server Actions, Route Handlers and Middleware, with Supabase Postgres and Row-Level Security as the data layer.",
      },
      {
        title: "Passwordless studio access",
        detail: "Passkeys (fingerprint, Face ID, Windows Hello) as the primary sign-in, with a backup password and magic link, locked to a single owner.",
      },
      {
        title: "Media pipeline that can't orphan files",
        detail: "Direct browser-to-Cloudinary uploads; the server re-verifies type, size and dimensions before saving, and rolls back the upload if the database write fails.",
      },
      {
        title: "Adaptive delivery",
        detail: "Every image is served with automatic format and quality and DPR-aware sizing; navigation is network-first with a cached app-shell fallback.",
      },
    ],
    outcomes: [
      "Publishing a photograph is an upload and a click: location and time are read from EXIF and a caption can be drafted by AI.",
      "Moderated guestbook and one-per-visitor reactions without requiring accounts.",
      "Visitors never see camera gear or technical settings; the studio stays private.",
    ],
    stack: ["Next.js 15", "React", "TypeScript", "Supabase", "PostgreSQL + RLS", "WebAuthn", "Cloudinary", "AI captions", "PWA"],
    sourceUrl: "https://github.com/aryanpol73/FRAME",
    liveUrl: "https://frame-aryan-on-cam.vercel.app",
    image: "/projects/frame.png",
    imageUrlLabel: "frame-aryan-on-cam.vercel.app",
  },
  {
    slug: "vocalyze",
    name: "Vocalyze",
    group: "ai",
    category: "MERN · AI Coaching",
    year: "2026",
    tagline: "Impromptu speaking practice with instant AI coaching and a /100 score.",
    summary:
      "Get a random AI-generated topic, prepare for 30 seconds, speak for up to five minutes, then receive Gemini feedback on clarity, structure, vocabulary, relevance and confidence.",
    metrics: [
      { value: "5", label: "scored speaking dimensions" },
      { value: "15", label: "achievements & streaks" },
      { value: "MERN", label: "full stack + Gemini" },
    ],
    problem:
      "Practising impromptu speaking alone gives no feedback, and generic AI chat doesn't track progress or keep people coming back. Learners needed structured, repeatable practice with measurable improvement.",
    architecture: [
      {
        title: "Classic MERN, done carefully",
        detail: "React + Vite + Tailwind client, Node + Express REST API, MongoDB with Mongoose models for users, sessions and achievements.",
      },
      {
        title: "AI kept on the server",
        detail: "Gemini analyses transcripts on the backend only; the API key never reaches the browser.",
      },
      {
        title: "Graceful degradation",
        detail: "If the key is missing or Gemini is down, the app switches to a curated topic bank and heuristic scoring, so nothing breaks.",
      },
      {
        title: "Security basics in place",
        detail: "bcrypt password hashing, JWT auth middleware, validated inputs, Helmet, CORS and rate limiting.",
      },
    ],
    outcomes: [
      "Each session returns 5 dimension scores, a filler-word count, an overall /100, 3 strengths, 3 improvements and one actionable tip.",
      "Progress dashboard with streaks, XP levels, a 14-day score chart and per-category performance.",
      "Gamification loop: daily challenge, 15 achievements and levels from Rookie to Legend.",
    ],
    stack: ["React", "Vite", "Tailwind CSS", "Node.js", "Express", "MongoDB", "Mongoose", "Gemini API", "JWT", "bcrypt"],
    sourceUrl: "https://github.com/aryanpol73/Vocalyze",
    liveUrl: "https://vocalyze-seven.vercel.app",
    image: "/projects/vocalyze.png",
    imageUrlLabel: "vocalyze-seven.vercel.app",
  },
  {
    slug: "fair-route",
    name: "FairRoute",
    group: "ai",
    category: "AI Ethics · Causal Inference",
    year: "2026",
    tagline: "Makes bias in gig-worker dispatch algorithms visible, measurable and human.",
    summary:
      "A 4-stage audit that proves whether wage gaps are caused by zone or shift bias, projects the long-term 'poverty trap', and turns the math into a plain-language report.",
    metrics: [
      { value: "4", label: "audit stages" },
      { value: "12 wk", label: "poverty-trap simulation" },
      { value: "GSC '26", label: "Google Solution Challenge" },
    ],
    problem:
      "Dispatch algorithms can quietly penalize workers by location or shift: fewer tasks lead to lower ratings, which lead to even fewer tasks. Platform managers rarely see it, and raw statistics don't persuade anyone to act.",
    architecture: [
      {
        title: "Causal inference, not correlation",
        detail: "DoWhy tests whether wage gaps are caused by structural bias rather than worker performance.",
      },
      {
        title: "Longitudinal and intersectional views",
        detail: "A 12-week simulation projects the poverty-trap timeline, and subgroup analysis finds the highest-risk groups such as night shifts in a specific zone.",
      },
      {
        title: "AI advocate layer",
        detail: "Gemini translates the findings into an empathetic, actionable report for non-technical decision makers.",
      },
      {
        title: "Split frontend and analytics backend",
        detail: "Next.js 14 dashboard over a Python Flask API, with audit history archived in Firebase.",
      },
    ],
    outcomes: [
      "Side-by-side comparison of a legacy black-box payout with a transparent, causally adjusted fair value.",
      "Driver-facing view with route suggestions toward more equitable zones.",
      "Built for UN Sustainable Development Goal 8 (decent work) in the Google Solution Challenge 2026.",
    ],
    stack: ["Next.js 14", "TypeScript", "Tailwind CSS", "Python", "Flask", "DoWhy", "pandas", "scikit-learn", "Gemini", "Firebase"],
    sourceUrl: "https://github.com/aryanpol73/Fair-Route",
    liveUrl: "https://fair-route.vercel.app",
    image: "/projects/fairroute.png",
    imageUrlLabel: "fair-route.vercel.app",
  },
  {
    slug: "aerokym",
    name: "Aerokym",
    group: "data",
    category: "Geospatial · Real-time Data",
    year: "2026",
    tagline: "A free, open turbulence map built from the signals airliners already broadcast.",
    summary:
      "Listens to public ADS-B feeds, detects the sharp vertical-rate changes turbulence causes, and maps them by altitude band next to official SIGMETs, PIREPs and METAR/TAF.",
    metrics: [
      { value: "0.79", label: "AUC vs pilot reports" },
      { value: "H3", label: "hex-cell aggregation" },
      { value: "213", label: "airports in demo" },
    ],
    problem:
      "Turbulence information is mostly locked in pilot reports and official products that are sparse in time and space. Every airliner already broadcasts its vertical rate; the question was whether that public data is dense enough to infer rough air.",
    architecture: [
      {
        title: "Ingest, store, replay",
        detail: "Public ADS-B traces land in Postgres with TimescaleDB, PostGIS and h3; a replay mode re-times real recorded flights so the whole pipeline runs offline.",
      },
      {
        title: "A detector calibrated against reality",
        detail: "The roughness detector is calibrated against pilot reports (PIREPs) and the method and results are written up openly.",
      },
      {
        title: "H3 aggregation behind an API",
        detail: "Detections are aggregated into hexagonal cells by altitude band and served by a FastAPI backend with documented endpoints.",
      },
      {
        title: "Map-first frontend",
        detail: "Next.js + MapLibre map with region, time-window and altitude filters, airport cards and official weather layers.",
      },
    ],
    outcomes: [
      "First one-day calibration on 429 US pilot reports: AUC 0.79 for rough vs smooth (0.50 baseline).",
      "All MVP milestones M0–M6 built and working on replayed data, from data spike to accuracy page.",
      "One-command Docker demo replays 50 real flights with no internet or API keys.",
      "Clearly labelled as research only, not for flight planning.",
    ],
    stack: ["Python", "FastAPI", "PostgreSQL", "TimescaleDB", "PostGIS", "H3", "Next.js", "MapLibre", "Docker", "GitHub Actions"],
    sourceUrl: "https://github.com/aryanpol73/aerokym",
    liveUrl: null,
    image: "/projects/aerokym.png",
    imageUrlLabel: "localhost:3000",
    imageNote: "Captured from a local run of the web app (pre-alpha, not yet deployed).",
  },
  {
    slug: "power",
    name: "P.O.W.E.R.",
    group: "data",
    category: "Forecasting · MLOps",
    year: "2026",
    tagline: "Forecasts EV charging demand 1–24 hours ahead and warns before transformers overload.",
    summary:
      "A real-time ML system with explained forecasts, calibrated uncertainty, drift detection and an operator console, deployed as a Pune pilot twin.",
    metrics: [
      { value: "31.8%", label: "better than seasonal naive" },
      { value: "9 days", label: "early drift alarm" },
      { value: "93", label: "tests passing" },
    ],
    problem:
      "Grid operators need to know where EV charging load will spike before it happens, with honest uncertainty. Naive forecasts break on zero-demand hours and shift silently when behaviour changes.",
    architecture: [
      {
        title: "Direct multi-horizon LightGBM",
        detail: "Horizon-as-feature models forecast every hour from 1 to 24 ahead, with Tweedie loss for the many zero-demand hours.",
      },
      {
        title: "Calibrated intervals",
        detail: "Conformalized quantile regression with adaptive conformal inference gives 90% intervals that stay honest under change.",
      },
      {
        title: "Leakage-proof by construction",
        detail: "Features are typed by anchor, with future-poisoning and split-purity tests; every access to the test period is logged with a reason.",
      },
      {
        title: "Full-stack operator console",
        detail: "FastAPI on PostgreSQL/TimescaleDB, a Next.js PWA console with a city map and what-if scenarios, and an MCP server so a copilot can cite every number.",
      },
    ],
    outcomes: [
      "Champion model is 31.8% more accurate than seasonal naive (WAPE 0.468 vs 0.686) at both 1-hour and 24-hour horizons.",
      "On the COVID-19 collapse, a CUSUM drift detector raised its first alarm 9 days before the regional lockdown order.",
      "A champion–challenger retrain that missed the 2% gate was correctly not promoted.",
      "93 tests including leakage tests, run on both SQLite and PostgreSQL.",
    ],
    stack: ["Python", "LightGBM", "Conformal prediction", "FastAPI", "PostgreSQL", "TimescaleDB", "Next.js 15", "MapLibre", "MCP", "Docker"],
    sourceUrl: "https://github.com/aryanpol73/P.O.W.E.R",
    liveUrl: null,
    image: "/projects/power.png",
    imageUrlLabel: "reports/pune/figures",
    imageNote: "Forecast figure from the repo's evaluation report.",
  },
  {
    slug: "reson8",
    name: "Reson8",
    group: "web",
    category: "PWA · Music Player",
    year: "2026",
    tagline: "An ad-free, glassmorphic music player PWA with Spotify sync.",
    summary:
      "Ambient backgrounds that shift with the album art, a floating glass player and spring-physics micro-interactions, with your real Spotify playlists.",
    metrics: [
      { value: "PKCE", label: "Spotify OAuth" },
      { value: "PWA", label: "installable, offline shell" },
      { value: "0", label: "ads" },
    ],
    problem:
      "Mainstream music apps are cluttered with ads and upsells. The aim was a calmer, more fluid listening experience that still works with the library people already have.",
    architecture: [
      {
        title: "Persistent global audio state",
        detail: "Zustand holds the queue, current track and playback so music keeps playing uninterrupted across screens.",
      },
      {
        title: "Colour that follows the music",
        detail: "Dominant colours are extracted from album art in real time to drive a blurred, animated mesh background behind glass panels.",
      },
      {
        title: "Spotify Web API with PKCE",
        detail: "Secure sign-in syncs real playlists, Liked Songs and recent tracks; the audio backend is abstracted so other sources can be swapped in.",
      },
      {
        title: "Prototyped fast with Lovable",
        detail: "Built on React, Vite, Tailwind, shadcn/ui and Framer Motion, with every change committed back to the GitHub repo.",
      },
    ],
    outcomes: [
      "Installable PWA with a service worker for instant offline shell loading.",
      "Floating glass player with seek, volume and an animated equalizer.",
      "Live and usable at its Lovable deployment.",
    ],
    stack: ["React", "Vite", "Tailwind CSS", "shadcn/ui", "Framer Motion", "Zustand", "Spotify Web API", "PWA"],
    sourceUrl: "https://github.com/aryanpol73/reson8-fluid",
    liveUrl: "https://reson8-fluid-sound.lovable.app",
    image: "/projects/reson8.png",
    imageUrlLabel: "reson8-fluid-sound.lovable.app",
  },
  {
    slug: "fence",
    name: "Fence",
    group: "tools",
    category: "Developer Tooling · Open Source",
    year: "2026",
    tagline: "Know why code exists before you delete it.",
    summary:
      "Traces any line or diff back to the commits, PRs and issues that explain it, grades the evidence A–D, and warns before a change removes code that exists for a recorded reason.",
    metrics: [
      { value: "A–D", label: "evidence grades" },
      { value: "0", label: "LLM calls, local-first" },
      { value: "4", label: "integrations incl. MCP" },
    ],
    problem:
      "Refactors and AI coding agents delete 'weird' code all the time, and sometimes that code was the fix for a production incident. The reason usually exists, buried in an old commit, PR or issue, but nobody looks it up.",
    architecture: [
      {
        title: "Grounded, never guessed",
        detail: "Every reason is a verbatim quote with a link to its source; anything inferred is labelled, and with no evidence Fence says 'reason unknown'.",
      },
      {
        title: "Incremental local index",
        detail: "Index a repository once; later runs process only new commits. Deterministic, no telemetry, network optional for reading GitHub PRs and issues.",
      },
      {
        title: "Fits every workflow",
        detail: "Ships as a CLI, git hooks and pre-commit hook, a GitHub Action, and an MCP server with a guardrail mode for AI coding agents.",
      },
    ],
    outcomes: [
      "Published on PyPI as gitfence, with CI on every push.",
      "Flags risky deletions with a risk score, evidence confidence and the exact quote that explains the code.",
      "Lets AI agents check for recorded decisions before they change code.",
    ],
    stack: ["Python 3.12", "Git", "GitHub API", "GitHub Actions", "MCP", "PyPI"],
    sourceUrl: "https://github.com/aryanpol73/fence",
    liveUrl: "https://pypi.org/project/gitfence/",
    liveLabel: "View on PyPI",
    image: "/projects/fence.png",
    imageUrlLabel: "terminal · fence CLI",
    imageNote: "Real CLI output from the repo's bundled demo repository.",
  },
];

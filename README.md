# Aryan Pol — Freelance Portfolio

Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 4 · Framer Motion 12 · Lucide.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Edit content

Every word on the site lives in [`data/portfolio.ts`](data/portfolio.ts) (profile, hero, services, process,
capabilities) and [`data/projects.ts`](data/projects.ts) (all 14 case studies). Components only render that data.

Project screenshots are 1440×900 PNGs in `public/projects/`, captured from each project's home page with headless
Chrome. Projects without a public deployment (Veract, Continuum, Aerokym) were
captured from a local run with demo data, which each case study states. To add a project, append an entry to
`data/projects.ts` and drop its screenshot in `public/projects/`. Set `featured: true` on up to four to put them in
the hero switcher and the large bento slots.

## Configuration (`.env.local`, see `.env.example`)

| Variable | Purpose |
| --- | --- |
| `WEB3FORMS_ACCESS_KEY` | Delivers the inquiry form to your inbox via Web3Forms. Without it, the form opens the visitor's email app with the brief pre-filled, so no lead is lost. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for OpenGraph / Twitter metadata. |
| `GITHUB_TOKEN` | Recommended. A read-only fine-grained token ("Public repositories" access). Unlocks the contribution count and heatmap and languages by code size, and avoids the 60-requests-per-hour anonymous limit that shared hosts like Vercel often hit. Stats refresh hourly; if GitHub fails during a refresh, the last good numbers stay up. |

To use a real scheduler for "Book a 15-Min Discovery Call", set `profile.bookingUrl` in `data/portfolio.ts` to your
Cal.com or Calendly link. While it's empty, the button opens a pre-written email.

## Structure

```
app/
  layout.tsx            fonts, metadata, no-flash theme script
  page.tsx              server component; fetches GitHub stats (ISR, 1h)
  globals.css           design tokens (dark default + light), utilities
  api/contact/route.ts  validated inquiry endpoint (Web3Forms or mailto fallback)
  opengraph-image.tsx   generated social card (also used for Twitter)
  icon.svg              monogram favicon
components/             Navbar, Hero, HeroBento, Work, CaseStudyDrawer, Services,
                        Process, About, Contact, Footer, + shared primitives
data/portfolio.ts       all content
lib/                    github stats, motion presets, inquiry validation, scroll helper
```

## Deploy

Push to GitHub and import in Vercel. Add the env vars above in the project settings.

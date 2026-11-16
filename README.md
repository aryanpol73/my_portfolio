# Aryan Pol — Freelance Portfolio

Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 4 · Framer Motion 12 · Lucide.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Edit content

Every word on the site lives in [`data/portfolio.ts`](data/portfolio.ts): profile links, hero copy, the four case
studies, services, process, capability matrix and budget ranges. Components only render that data.

## Configuration (`.env.local`, see `.env.example`)

| Variable | Purpose |
| --- | --- |
| `WEB3FORMS_ACCESS_KEY` | Delivers the inquiry form to your inbox via Web3Forms. Without it, the form opens the visitor's email app with the brief pre-filled, so no lead is lost. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for OpenGraph / Twitter metadata. |
| `GITHUB_TOKEN` | Optional. Raises the GitHub API rate limit for the live stats card (refreshed hourly; falls back to a snapshot). |

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

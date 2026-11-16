import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Atmosphere } from "@/components/Atmosphere";
import { CommandPalette } from "@/components/CommandPalette";
import { Providers } from "@/components/Providers";
import { ServiceWorker } from "@/components/ServiceWorker";
import { hero, profile } from "@/data/portfolio";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const title = `${profile.name} — ${profile.role}`;
const description =
  "Freelance full-stack and AI engineer. Real-time web apps, PWAs, AI agent workflows and ML dashboards, shipped to production with tests, CI and clean handoff.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s · ${profile.name}` },
  description,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: profile.githubUrl }],
  creator: profile.name,
  keywords: [
    "freelance full-stack developer",
    "Next.js developer",
    "AI engineer",
    "PWA development",
    "real-time web apps",
    "LLM integration",
    "machine learning dashboards",
    "Pune",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: profile.name,
    title,
    description: hero.headline,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: hero.headline,
  },
  robots: { index: true, follow: true },
  appleWebApp: { capable: true, title: profile.name, statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icons/favicon-48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Runs before paint so the stored theme applies with no flash. Dark is the default. */
const themeScript = `(function(){try{var t=localStorage.getItem('theme');document.documentElement.dataset.theme=(t==='light'||t==='dark')?t:'dark';}catch(e){document.documentElement.dataset.theme='dark';}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${jakarta.variable} ${jetbrains.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-invert-bg focus:px-4 focus:py-2 focus:text-invert-fg"
        >
          Skip to content
        </a>
        <Atmosphere />
        <ServiceWorker />
        <Providers>
          {children}
          <CommandPalette />
        </Providers>
      </body>
    </html>
  );
}

import type { MetadataRoute } from "next";
import { profile } from "@/data/portfolio";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: `${profile.name} — ${profile.role}`,
    short_name: profile.name,
    description: "Freelance full-stack and AI engineer: case studies, services and a direct line to start a project.",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#09090b",
    theme_color: "#09090b",
    categories: ["business", "productivity", "developer"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/brand/logo.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
    shortcuts: [
      {
        name: "Case studies",
        short_name: "Work",
        url: "/?source=pwa#work",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Start a project",
        short_name: "Contact",
        url: "/?source=pwa#contact",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
    ],
  };
}

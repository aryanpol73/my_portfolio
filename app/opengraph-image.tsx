import { ImageResponse } from "next/og";
import { hero, profile, projects } from "@/data/portfolio";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#09090B",
          color: "#FAFAFA",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, color: "#A1A1AA" }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: "#10B981" }} />
          {profile.availability}
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, letterSpacing: -2, lineHeight: 1.08, maxWidth: 1000 }}>
          {hero.headline}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontWeight: 700, fontSize: 30 }}>{profile.name}</div>
            <div style={{ color: "#A1A1AA" }}>{profile.role}</div>
          </div>
          <div style={{ display: "flex", gap: 12, color: "#A1A1AA" }}>
            {projects.filter((p) => p.featured).map((p) => (
              <div key={p.slug} style={{ border: "1px solid #27272A", borderRadius: 10, padding: "8px 14px" }}>
                {p.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}

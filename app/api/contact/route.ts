import { NextResponse } from "next/server";
import { profile } from "@/data/portfolio";
import { serviceLabel, validateInquiry, type InquiryPayload } from "@/lib/inquiry";

export const runtime = "nodejs";

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

export async function POST(request: Request) {
  let raw: Record<string, unknown>;
  try {
    raw = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const payload: InquiryPayload = {
    name: str(raw.name),
    email: str(raw.email),
    service: str(raw.service) as InquiryPayload["service"],
    budget: str(raw.budget) as InquiryPayload["budget"],
    brief: str(raw.brief),
    website: str(raw.website),
  };

  // Honeypot filled: pretend success so bots learn nothing.
  if (payload.website) return NextResponse.json({ ok: true });

  const errors = validateInquiry(payload);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, error: "validation", errors }, { status: 422 });
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    // No delivery provider configured: the client falls back to the visitor's email app.
    return NextResponse.json({ ok: false, error: "not_configured", to: profile.email }, { status: 503 });
  }

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `New project inquiry: ${serviceLabel(payload.service)} (${payload.budget})`,
        from_name: "Portfolio inquiry",
        name: payload.name.trim(),
        email: payload.email.trim(),
        replyto: payload.email.trim(),
        service: serviceLabel(payload.service),
        budget: payload.budget,
        message: payload.brief.trim(),
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { success?: boolean };
    if (!res.ok || !data.success) {
      return NextResponse.json({ ok: false, error: "delivery_failed", to: profile.email }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "delivery_failed", to: profile.email }, { status: 502 });
  }
}

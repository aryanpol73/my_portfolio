import { budgetRanges, services, type BudgetRange, type ServiceId } from "@/data/portfolio";

export type InquiryService = ServiceId | "other";

export interface InquiryPayload {
  name: string;
  email: string;
  service: InquiryService | "";
  budget: BudgetRange | "";
  brief: string;
  /** Honeypot: real visitors never fill this in. */
  website?: string;
}

export type InquiryErrors = Partial<Record<"name" | "email" | "service" | "budget" | "brief", string>>;

export const BRIEF_MIN = 30;
export const BRIEF_MAX = 2000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function serviceLabel(id: InquiryService | ""): string {
  if (id === "other") return "Something else";
  return services.find((s) => s.id === id)?.title ?? "Not specified";
}

/** Shared by the client form and the API route so both enforce identical rules. */
export function validateInquiry(p: InquiryPayload): InquiryErrors {
  const errors: InquiryErrors = {};
  if (p.name.trim().length < 2) errors.name = "Please enter your name.";
  else if (p.name.length > 100) errors.name = "Please keep your name under 100 characters.";
  if (!EMAIL_RE.test(p.email.trim())) errors.email = "Please enter a valid email address.";
  const validService = p.service === "other" || services.some((s) => s.id === p.service);
  if (!validService) errors.service = "Choose the closest match. 'Something else' works too.";
  if (!budgetRanges.includes(p.budget as BudgetRange)) errors.budget = "Pick a budget range.";
  const len = p.brief.trim().length;
  if (len < BRIEF_MIN) errors.brief = `A couple of sentences helps: at least ${BRIEF_MIN} characters.`;
  else if (len > BRIEF_MAX) errors.brief = `Please keep the brief under ${BRIEF_MAX} characters.`;
  return errors;
}

export function buildMailto(to: string, p: InquiryPayload): string {
  const subject = `Project inquiry: ${serviceLabel(p.service)} (${p.budget || "budget TBD"})`;
  const body = `Hi Aryan,\n\n${p.brief.trim()}\n\nService: ${serviceLabel(p.service)}\nBudget: ${p.budget}\n\n${p.name.trim()}\n${p.email.trim()}`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

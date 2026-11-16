"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { ServiceId } from "@/data/portfolio";
import { spring } from "@/lib/motion";

interface InquiryState {
  service: ServiceId | "";
  /** Bumps on every request so the form re-focuses even if the same service is picked twice. */
  nonce: number;
  selectService: (id: ServiceId | "") => void;
}

interface ToastState {
  showToast: (message: string) => void;
}

interface CaseStudyState {
  activeSlug: string | null;
  openCaseStudy: (slug: string) => void;
  closeCaseStudy: () => void;
}

const InquiryContext = createContext<InquiryState | null>(null);
const ToastContext = createContext<ToastState | null>(null);
const CaseStudyContext = createContext<CaseStudyState | null>(null);

export function useCaseStudy(): CaseStudyState {
  const ctx = useContext(CaseStudyContext);
  if (!ctx) throw new Error("useCaseStudy must be used inside <Providers>");
  return ctx;
}

export function useInquiry(): InquiryState {
  const ctx = useContext(InquiryContext);
  if (!ctx) throw new Error("useInquiry must be used inside <Providers>");
  return ctx;
}

export function useToast(): ToastState {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <Providers>");
  return ctx;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [service, setService] = useState<ServiceId | "">("");
  const [nonce, setNonce] = useState(0);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectService = useCallback((id: ServiceId | "") => {
    setService(id);
    setNonce((n) => n + 1);
  }, []);

  const showToast = useCallback((message: string) => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ id: Date.now(), message });
    timer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const openCaseStudy = useCallback((slug: string) => setActiveSlug(slug), []);
  const closeCaseStudy = useCallback(() => setActiveSlug(null), []);

  const inquiry = useMemo(() => ({ service, nonce, selectService }), [service, nonce, selectService]);
  const toastValue = useMemo(() => ({ showToast }), [showToast]);
  const caseStudy = useMemo(
    () => ({ activeSlug, openCaseStudy, closeCaseStudy }),
    [activeSlug, openCaseStudy, closeCaseStudy],
  );

  return (
    <MotionConfig reducedMotion="user">
      <InquiryContext.Provider value={inquiry}>
        <ToastContext.Provider value={toastValue}>
          <CaseStudyContext.Provider value={caseStudy}>{children}</CaseStudyContext.Provider>
          <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4">
            <AnimatePresence>
              {toast && (
                <motion.div
                  key={toast.id}
                  role="status"
                  initial={{ opacity: 0, y: 16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={spring}
                  className="flex items-center gap-2 rounded-full bg-invert-bg px-4 py-2.5 text-sm font-medium text-invert-fg shadow-2xl shadow-black/30"
                >
                  <CheckCircle2 className="size-4 text-accent" aria-hidden />
                  {toast.message}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ToastContext.Provider>
      </InquiryContext.Provider>
    </MotionConfig>
  );
}

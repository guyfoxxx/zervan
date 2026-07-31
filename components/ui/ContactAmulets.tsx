"use client";

import { motion } from "framer-motion";
import { buildWhatsAppUrl, buildTelegramUrl } from "./ProjectContactLinks";

const GENERAL_MESSAGE =
  "سلام، من از سایت زروان مزاحم می‌شوم. دربارهٔ همکاری و مشاوره طراحی سرامیک می‌خواستم صحبت کنم.";

function pulse(delay: number) {
  return {
    animate: { scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] },
    transition: { duration: 3, repeat: Infinity, delay, ease: "easeInOut" as const },
  };
}

export default function ContactAmulets() {
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
      role="complementary"
      aria-label="تماس فوری"
    >
      <motion.a
        href={buildTelegramUrl(GENERAL_MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="گفتگو در تلگرام"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-sky-400/30 bg-sky-950/60 backdrop-blur-sm"
      >
        <motion.span
          {...pulse(1.5)}
          className="absolute inset-0 rounded-full bg-sky-400/20"
        />
        <TelegramIcon className="h-5 w-5 text-sky-300 relative z-10" />
      </motion.a>

      <motion.a
        href={buildWhatsAppUrl(GENERAL_MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="گفتگو در واتساپ"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-950/60 backdrop-blur-sm"
      >
        <motion.span
          {...pulse(0)}
          className="absolute inset-0 rounded-full bg-emerald-400/20"
        />
        <WhatsAppIcon className="h-5 w-5 text-emerald-300 relative z-10" />
      </motion.a>
    </div>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.02 2C6.5 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.08-1.33A9.96 9.96 0 0 0 12.02 22C17.53 22 22 17.52 22 12S17.53 2 12.02 2zm0 18.1a8.1 8.1 0 0 1-4.14-1.14l-.3-.18-3.02.79.8-2.94-.2-.3a8.07 8.07 0 0 1-1.24-4.33c0-4.47 3.64-8.1 8.1-8.1 4.46 0 8.1 3.63 8.1 8.1 0 4.47-3.64 8.1-8.1 8.1z" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M21.5 3.5 2.75 10.9c-1.1.44-1.1 1.06-.2 1.34l4.8 1.5 1.86 5.66c.22.6.4.84.8.84.43 0 .62-.19.86-.42l2.06-2 4.28 3.16c.79.44 1.36.21 1.56-.73l2.82-13.3c.3-1.14-.44-1.66-1.13-1.45z" />
    </svg>
  );
}

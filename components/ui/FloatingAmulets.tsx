"use client";

import { motion } from "framer-motion";
import ContactAmulets from "./ContactAmulets";

export default function FloatingAmulets({
  onOpenPortfolio,
}: {
  onOpenPortfolio: () => void;
}) {
  return (
    <>
      <motion.button
        onClick={onOpenPortfolio}
        aria-label="گنجینۀ لحظات جاودان"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        whileHover={{ scale: 1.08 }}
        className="pointer-events-auto fixed bottom-6 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-amber-500/30 bg-stone-950/70 backdrop-blur-sm"
      >
        <ZurvanGlyph className="h-6 w-6 text-amber-400" />
      </motion.button>

      {/* pointer-events-auto is set inside ContactAmulets itself */}
      <ContactAmulets />
    </>
  );
}

// Simplified ouroboros + flame glyph
function ZurvanGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle
        cx="12"
        cy="13"
        r="7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeDasharray="2 3"
      />
      <path
        d="M12 3c1.2 1.6 1.8 2.8 1.2 4.2-.4.9-1.4 1-1.4 2 0 .8.8 1 1.2 1.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

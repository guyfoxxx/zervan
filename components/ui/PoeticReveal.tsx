"use client";

import { motion } from "framer-motion";
import { buildWhatsAppUrl, buildTelegramUrl } from "../ui/ProjectContactLinks";

interface PieceResult {
  pieceName: string;
  couplet: { line1: string; line2: string };
  code: string;
}

export default function PoeticReveal({
  result,
  onSaveToOrder,
}: {
  result: PieceResult;
  onSaveToOrder: () => void;
}) {
  const orderMessage = `سلام، می‌خواهم دربارهٔ طرح «${result.pieceName}» (کد ${result.code}) با استاد صحبت کنم.
${result.couplet.line1}
${result.couplet.line2}`;

  return (
    <motion.div
      dir="rtl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-black/70 px-6 text-center"
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm tracking-widest text-amber-500/70 mb-4"
      >
        {result.code}
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="font-serif text-4xl md:text-5xl text-amber-100 mb-6"
      >
        {result.pieceName}
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="mb-10 space-y-1 text-stone-300 italic"
      >
        <p>{result.couplet.line1}</p>
        <p>{result.couplet.line2}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <button
          onClick={onSaveToOrder}
          className="rounded-full bg-amber-600 px-6 py-3 text-sm font-medium text-black hover:bg-amber-500 transition-colors"
        >
          این لحظه را به خاک بسپار
        </button>

        <a
          href={buildWhatsAppUrl(orderMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-stone-600 px-6 py-3 text-sm text-stone-200 hover:border-stone-400 transition-colors"
        >
          این طرح را مستقیم با استاد مطرح کن
        </a>
      </motion.div>
    </motion.div>
  );
}

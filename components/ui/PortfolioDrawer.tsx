"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import portfolio from "@/data/portfolio.json";
import { buildTelegramUrl, buildWhatsAppUrl } from "./ProjectContactLinks";

export default function PortfolioDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex items-stretch justify-end bg-black/50 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="relative h-full w-full max-w-5xl border-r border-amber-500/20 bg-stone-950/90 px-6 py-10 overflow-hidden"
          >
            <button
              onClick={onClose}
              aria-label="بستن گنجینه"
              className="absolute left-6 top-6 h-9 w-9 rounded-full border border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
            >
              ×
            </button>

            <h2 className="font-serif text-3xl text-amber-200 mb-8">
              گنجینۀ لحظات جاودان
            </h2>

            <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory [scrollbar-width:thin]">
              {portfolio.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProjectCard({ project }: { project: (typeof portfolio)[number] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: px * 10, y: py * -10 });
  }

  const message = `سلام، من از سایت زروان روی پروژهٔ ${project.title} هستم. می‌خواستم مشاوره بگیرم.`;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="relative min-w-[320px] snap-start rounded-xl border border-amber-500/10 bg-stone-900/60 p-4"
      style={{ perspective: 800 }}
    >
      <motion.div
        animate={{ rotateX: tilt.y, rotateY: tilt.x }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <img
          src={project.image}
          alt={project.title}
          className="h-48 w-full rounded-lg object-cover"
        />
      </motion.div>

      <h3 className="mt-4 font-serif text-xl text-stone-100">
        {project.title}
      </h3>
      <p className="mt-1 text-sm italic text-amber-400/80">{project.poem}</p>

      {/* Real link into the SEO-indexable project page — the drawer stays
          magical, but every card also points to crawlable content. */}
      <Link
        href={`/projects/${project.id}`}
        className="mt-2 inline-block text-xs text-stone-500 hover:text-stone-300 underline"
      >
        مشاهدهٔ کامل پروژه
      </Link>

      <div className="mt-4 flex gap-2">
        <a
          href={buildWhatsAppUrl(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-full border border-emerald-700/40 bg-emerald-900/20 px-3 py-1.5 text-center text-xs text-emerald-300"
        >
          استعلام در واتساپ
        </a>
        <a
          href={buildTelegramUrl(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-full border border-sky-700/40 bg-sky-900/20 px-3 py-1.5 text-center text-xs text-sky-300"
        >
          استعلام در تلگرام
        </a>
      </div>
    </div>
  );
}

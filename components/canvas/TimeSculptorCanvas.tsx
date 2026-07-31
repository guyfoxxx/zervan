"use client";

import { useCallback, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import ClayMorphMesh from "./ClayMorphMesh";
import GlazeShaderMaterial from "./GlazeShaderMaterial"; // registers <glazeShaderMaterial />
import PoeticReveal from "../ui/PoeticReveal";
import FloatingAmulets from "../ui/FloatingAmulets";
import PortfolioDrawer from "../ui/PortfolioDrawer";

type Phase = "form" | "glaze" | "reveal";

interface PieceResult {
  pieceName: string;
  couplet: { line1: string; line2: string };
  code: string;
}

export default function TimeSculptorCanvas() {
  const [phase, setPhase] = useState<Phase>("form");
  const [timeAxis, setTimeAxis] = useState(0); // -1..1, frozen once form is chosen
  const [glazeAxis, setGlazeAxis] = useState(0.5); // 0..1, frozen once glaze is chosen
  const [formFrozen, setFormFrozen] = useState(false);
  const [glazeFrozen, setGlazeFrozen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [result, setResult] = useState<PieceResult | null>(null);
  const [loading, setLoading] = useState(false);

  const pointerActiveRef = useRef(false);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1; // -1..1
      const ny = e.clientY / window.innerHeight; // 0..1

      if (phase === "form") {
        setTimeAxis(nx);
      } else if (phase === "glaze") {
        setGlazeAxis(ny);
      }
    },
    [phase]
  );

  // Phase 1 -> Phase 2 transition
  function confirmForm() {
    if (!formFrozen) return;
    setPhase("glaze");
  }

  // Phase 2 -> Data Alchemy
  async function confirmGlaze() {
    if (!glazeFrozen) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate-piece", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeAxis, glazeAxis }),
      });
      const data = await res.json();
      setResult(data);
      setPhase("reveal");
    } finally {
      setLoading(false);
    }
  }

  function handleSaveToOrder() {
    // Minimal order form: in production this posts { timeAxis, glazeAxis,
    // ...result } to an API route that emails/stores the order.
    console.log("order submitted", { timeAxis, glazeAxis, result });
  }

  return (
    <div
      className="relative h-screen w-screen bg-black overflow-hidden"
      onPointerMove={handlePointerMove}
    >
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[3, 3, 3]} intensity={1.2} />
        <DustParticles />

        {(phase === "form" || phase === "glaze") && (
          // NOTE: ClayMorphMesh currently renders the imported GLTF scene
          // via <primitive>. To swap in glazeShaderMaterial during phase 2,
          // ClayMorphMesh needs a prop like `overrideMaterial` that it applies
          // to the mesh's `.material` in useEffect/useFrame (primitives don't
          // accept material as a JSX child). Left as a TODO here so the two
          // phases stay visually decoupled and easy to reason about.
          <ClayMorphMesh timeAxis={timeAxis} onFreeze={setFormFrozen} />
        )}
      </Canvas>

      {/* 2D overlay UI, always on top of the canvas */}
      <div className="pointer-events-none absolute inset-0" dir="rtl">
        <AnimatePresence mode="wait">
          {phase === "form" && (
            <PhaseInstruction key="form-instr" text="زمان را حرکت بده." />
          )}
          {phase === "glaze" && (
            <PhaseInstruction key="glaze-instr" text="اکنون رنگ زمان را انتخاب کن." />
          )}
        </AnimatePresence>

        {phase === "form" && formFrozen && (
          <CenteredCTA label="این فرم را برگزین" onClick={confirmForm} />
        )}
        {phase === "glaze" && glazeFrozen && (
          <CenteredCTA
            label="این لعاب لحظه را جاودانه کن"
            onClick={confirmGlaze}
            loading={loading}
          />
        )}
      </div>

      <FloatingAmulets onOpenPortfolio={() => setPortfolioOpen(true)} />
      <PortfolioDrawer open={portfolioOpen} onClose={() => setPortfolioOpen(false)} />

      <AnimatePresence>
        {phase === "reveal" && result && (
          <PoeticReveal result={result} onSaveToOrder={handleSaveToOrder} />
        )}
      </AnimatePresence>
    </div>
  );
}

function PhaseInstruction({ text }: { text: string }) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="absolute top-16 left-1/2 -translate-x-1/2 text-lg text-stone-300 tracking-wide"
    >
      {text}
    </motion.p>
  );
}

function CenteredCTA({
  label,
  onClick,
  loading,
}: {
  label: string;
  onClick: () => void;
  loading?: boolean;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      onClick={onClick}
      disabled={loading}
      className="pointer-events-auto absolute bottom-24 left-1/2 -translate-x-1/2 rounded-full bg-amber-600/90 px-8 py-3 text-sm font-medium text-black hover:bg-amber-500 transition-colors disabled:opacity-50"
    >
      {loading ? "..." : label}
    </motion.button>
  );
}

function DustParticles() {
  // Lightweight drifting dust — swap for a GPU-instanced points shader
  // if particle count needs to scale up.
  const count = 300;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#8a7a5c" transparent opacity={0.5} />
    </points>
  );
}

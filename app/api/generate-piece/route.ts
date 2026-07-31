import { NextRequest, NextResponse } from "next/server";
import poetry from "@/data/poetryDatabase.json";

type Era = "ancient" | "classical" | "future";
type TimeOfDay = "dawn" | "midday" | "dusk" | "night";

interface GenerateRequest {
  timeAxis: number; // -1 (deep past) .. 1 (far future)
  glazeAxis: number; // 0 (dawn) .. 1 (night)
  seed?: string;
}

// timeAxis -> era. Three bands, mirroring the three morph-target regions
// described in the form sculptor (ancient artifact / classical-modern / future).
function eraFromTimeAxis(t: number): Era {
  if (t < -0.33) return "ancient";
  if (t < 0.33) return "classical";
  return "future";
}

// glazeAxis -> time of day, matching the four glaze shader bands.
function timeOfDayFromGlazeAxis(g: number): TimeOfDay {
  if (g < 0.25) return "dawn";
  if (g < 0.5) return "midday";
  if (g < 0.75) return "dusk";
  return "night";
}

const ERA_NAMES: Record<Era, string> = {
  ancient: "دیرینه",
  classical: "میانه",
  future: "ناآمده",
};

const TOD_NAMES: Record<TimeOfDay, string> = {
  dawn: "بامداد",
  midday: "نیم‌روز",
  dusk: "شامگاه",
  night: "شب",
};

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h;
}

function generateCode(era: Era, tod: TimeOfDay, rand: () => number) {
  const eraCode = { ancient: "AN", classical: "CL", future: "FU" }[era];
  const todCode = { dawn: "DW", midday: "MD", dusk: "DS", night: "NT" }[tod];
  const num = Math.floor(rand() * 9000 + 1000);
  return `ZRV-${eraCode}${todCode}-${num}`;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as GenerateRequest;
  const { timeAxis, glazeAxis, seed } = body;

  if (
    typeof timeAxis !== "number" ||
    typeof glazeAxis !== "number" ||
    timeAxis < -1 ||
    timeAxis > 1 ||
    glazeAxis < 0 ||
    glazeAxis > 1
  ) {
    return NextResponse.json(
      { error: "timeAxis must be -1..1 and glazeAxis must be 0..1" },
      { status: 400 }
    );
  }

  const era = eraFromTimeAxis(timeAxis);
  const tod = timeOfDayFromGlazeAxis(glazeAxis);

  const seedString = seed ?? `${timeAxis}-${glazeAxis}-${Date.now()}`;
  const rand = mulberry32(hashSeed(seedString));

  // Prefer an exact era+timeOfDay match; fall back to era-only match.
  const exact = poetry.filter((p) => p.era === era && p.timeOfDay === tod);
  const pool = exact.length > 0 ? exact : poetry.filter((p) => p.era === era);
  const chosen = pool[Math.floor(rand() * pool.length)] ?? poetry[0];

  const pieceName = `${ERA_NAMES[era]} ${TOD_NAMES[tod]}`;
  const code = generateCode(era, tod, rand);

  return NextResponse.json({
    pieceName,
    era,
    timeOfDay: tod,
    couplet: { line1: chosen.line1, line2: chosen.line2 },
    code,
  });
}

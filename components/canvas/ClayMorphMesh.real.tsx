"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// 5-7 key forms, ordered from deep-past artifact to far-future geometry.
// Each is a morph target on the SAME base mesh topology (sculpted/retopologized
// to share vertex count) so morphTargetInfluences can blend between them.
const MORPH_MODEL_PATH = "/models/clay-morph-set.glb";
const MORPH_COUNT = 7; // rhyton, elamite-brick, persepolis-fragment, modern-tile-a, modern-tile-b, parametric-a, parametric-b

interface ClayMorphMeshProps {
  timeAxis: number; // -1..1, driven by horizontal pointer
  onFreeze?: (frozen: boolean) => void;
}

export default function ClayMorphMesh({ timeAxis, onFreeze }: ClayMorphMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { scene } = useGLTF(MORPH_MODEL_PATH) as any;
  const lastAxisRef = useRef(timeAxis);
  const stillSinceRef = useRef<number | null>(null);
  const [frozen, setFrozen] = useState(false);
  const glowRef = useRef(0);

  useEffect(() => {
    // detect movement to reset the freeze timer
    if (Math.abs(timeAxis - lastAxisRef.current) > 0.002) {
      lastAxisRef.current = timeAxis;
      stillSinceRef.current = null;
      if (frozen) {
        setFrozen(false);
        onFreeze?.(false);
      }
    } else if (stillSinceRef.current === null) {
      stillSinceRef.current = performance.now();
    }
  }, [timeAxis, frozen, onFreeze]);

  useFrame((state, delta) => {
    const mesh = meshRef.current as any;
    if (!mesh?.morphTargetInfluences) return;

    // Map timeAxis (-1..1) to a continuous position across MORPH_COUNT targets,
    // then blend only the two neighboring targets (classic linear morph blend).
    const pos = ((timeAxis + 1) / 2) * (MORPH_COUNT - 1); // 0..(N-1)
    const lower = Math.floor(pos);
    const upper = Math.min(lower + 1, MORPH_COUNT - 1);
    const t = pos - lower;

    for (let i = 0; i < MORPH_COUNT; i++) {
      mesh.morphTargetInfluences[i] = 0;
    }
    mesh.morphTargetInfluences[lower] = 1 - t;
    mesh.morphTargetInfluences[upper] = t;

    // check freeze threshold
    if (!frozen && stillSinceRef.current !== null) {
      const elapsed = performance.now() - stillSinceRef.current;
      if (elapsed > 1500) {
        setFrozen(true);
        onFreeze?.(true);
      }
    }

    // subtle glow pulse when frozen
    const targetGlow = frozen ? 1 : 0;
    glowRef.current = THREE.MathUtils.lerp(glowRef.current, targetGlow, delta * 4);
    const mat = mesh.material as THREE.MeshStandardMaterial;
    if (mat?.emissive) {
      mat.emissiveIntensity = glowRef.current * 0.6;
    }
  });

  return (
    <primitive object={scene} ref={meshRef} scale={1.2} position={[0, 0, 0]} />
  );
}

useGLTF.preload(MORPH_MODEL_PATH);

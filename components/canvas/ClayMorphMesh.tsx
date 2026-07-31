"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// TEMPORARY placeholder for ClayMorphMesh.tsx, until the real 7-target
// GLTF (clay-morph-set.glb) exists. Instead of blending between separate
// meshes, this procedurally deforms a single IcosahedronGeometry using a
// noise field whose parameters (frequency, amplitude, angularity) shift
// with timeAxis — so it still reads as "form changing across time" even
// though it's not the real sculpted artifacts yet.
//
// Swap this file out for the real ClayMorphMesh.tsx once the GLB is ready;
// the props (timeAxis, onFreeze) are kept identical so TimeSculptorCanvas
// doesn't need to change.

interface ClayMorphMeshProps {
  timeAxis: number; // -1..1
  onFreeze?: (frozen: boolean) => void;
}

// simple 3D value noise, no external deps
function noise3D(x: number, y: number, z: number) {
  const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return s - Math.floor(s);
}

export default function ClayMorphMesh({ timeAxis, onFreeze }: ClayMorphMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const baseGeometry = useMemo(() => new THREE.IcosahedronGeometry(1, 5), []);
  const basePositions = useMemo(
    () => baseGeometry.attributes.position.array.slice(),
    [baseGeometry]
  );

  const lastAxisRef = useRef(timeAxis);
  const stillSinceRef = useRef<number | null>(null);
  const [frozen, setFrozen] = useState(false);
  const glowRef = useRef(0);

  useEffect(() => {
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

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const geom = mesh.geometry as THREE.BufferGeometry;
    const pos = geom.attributes.position;
    const arr = pos.array as Float32Array;

    // -1 (deep past) => low-freq, angular, rough (ancient artifact feel)
    // 0 (present)    => smooth, minimal, low amplitude (modern tile feel)
    // +1 (future)    => high-freq, fluid, exaggerated (parametric feel)
    const t = timeAxis; // -1..1
    const freq = 1.5 + Math.abs(t) * 3.5;
    const amplitude = 0.06 + Math.abs(t) * 0.22;
    const angularity = t < 0 ? Math.abs(t) : 0; // only past gets "faceted" look

    for (let i = 0; i < arr.length; i += 3) {
      const bx = basePositions[i];
      const by = basePositions[i + 1];
      const bz = basePositions[i + 2];

      let n = noise3D(bx * freq, by * freq, bz * freq);
      if (angularity > 0) {
        n = Math.floor(n * 4) / 4; // quantize noise for a rougher, artifact-like facet
      }

      const displaced = 1 + (n - 0.5) * amplitude;
      arr[i] = bx * displaced;
      arr[i + 1] = by * displaced;
      arr[i + 2] = bz * displaced;
    }

    pos.needsUpdate = true;
    geom.computeVertexNormals();

    if (!frozen && stillSinceRef.current !== null) {
      const elapsed = performance.now() - stillSinceRef.current;
      if (elapsed > 1500) {
        setFrozen(true);
        onFreeze?.(true);
      }
    }

    const targetGlow = frozen ? 1 : 0;
    glowRef.current = THREE.MathUtils.lerp(glowRef.current, targetGlow, delta * 4);
    const mat = mesh.material as THREE.MeshStandardMaterial;
    if (mat?.emissive) {
      mat.emissiveIntensity = glowRef.current * 0.6;
    }
  });

  return (
    <mesh ref={meshRef} geometry={baseGeometry} scale={1.2}>
      <meshStandardMaterial
        color="#8a6a4a"
        roughness={0.85}
        metalness={0.05}
        emissive="#d99a4e"
        emissiveIntensity={0}
      />
    </mesh>
  );
}

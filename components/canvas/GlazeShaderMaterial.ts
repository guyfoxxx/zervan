import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

// vTimeOfDay: 0 = dawn, 0.33 = midday, 0.66 = dusk, 1 = night
// Each band is a distinct procedural look; we blend smoothly across
// neighboring bands so the sweep feels continuous rather than stepped.

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTimeOfDay; // 0..1
  uniform float uTime;      // running clock, for sparkle / crackle motion
  varying vec3 vNormal;
  varying vec3 vPosition;

  // cheap hash noise
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  vec3 dawnGlaze(vec3 n) {
    // matte crackled salt-glaze, cool pinks
    float crackle = step(0.94, hash(floor(vPosition * 40.0)));
    vec3 base = mix(vec3(0.90, 0.78, 0.80), vec3(0.80, 0.65, 0.70), crackle);
    return base * (0.6 + 0.4 * max(dot(n, vec3(0.0, 1.0, 0.3)), 0.0));
  }

  vec3 middayGlaze(vec3 n) {
    // brilliant glossy metallic gold/copper
    float fresnel = pow(1.0 - max(dot(n, vec3(0.0, 0.0, 1.0)), 0.0), 2.0);
    vec3 base = mix(vec3(0.72, 0.45, 0.15), vec3(1.0, 0.85, 0.4), fresnel);
    return base;
  }

  vec3 duskGlaze(vec3 n) {
    // deep purples, oily luster
    float sheen = pow(max(dot(n, vec3(0.3, 0.5, 0.8)), 0.0), 6.0);
    vec3 base = vec3(0.25, 0.08, 0.30) + sheen * vec3(0.5, 0.2, 0.6);
    return base;
  }

  vec3 nightGlaze(vec3 n) {
    // velvet matte black with sparkling crystal particles
    float sparkle = step(0.985, hash(floor(vPosition * 120.0 + uTime * 0.5)));
    vec3 base = vec3(0.02, 0.02, 0.03);
    return base + sparkle * vec3(0.8, 0.85, 1.0);
  }

  void main() {
    vec3 n = normalize(vNormal);
    vec3 color;

    if (uTimeOfDay < 0.333) {
      float t = uTimeOfDay / 0.333;
      color = mix(dawnGlaze(n), middayGlaze(n), t);
    } else if (uTimeOfDay < 0.666) {
      float t = (uTimeOfDay - 0.333) / 0.333;
      color = mix(middayGlaze(n), duskGlaze(n), t);
    } else {
      float t = (uTimeOfDay - 0.666) / 0.334;
      color = mix(duskGlaze(n), nightGlaze(n), t);
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;

const GlazeShaderMaterial = shaderMaterial(
  { uTimeOfDay: 0, uTime: 0 },
  vertexShader,
  fragmentShader
);

extend({ GlazeShaderMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    glazeShaderMaterial: {
      uTimeOfDay?: number;
      uTime?: number;
      ref?: React.Ref<THREE.ShaderMaterial>;
    };
  }
}

export default GlazeShaderMaterial;

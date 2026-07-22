import { useMemo, useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { createText, createHeart } from "./ShapeGenerator";
import { useHand } from "../hand/HandContext";

export default function ParticleSystem() {
  const pointsRef = useRef();

  // Gesture & posisi jari
  const { gesture, finger } = useHand();
  const [handDetected, setHandDetected] = useState(false);

  const count = 7000;

  const sequence = [
    { type: "text", value: "HALLO" },
    { type: "text", value: "SAYANG" },
    { type: "text", value: "I LOVE YOU" },
    { type: "heart" },
    { type: "text", value: "MWAHH" },
  ];

  const colors = [
    "#ff66cc",
    "#d96bff",
    "#ff4d88",
    "#ff0000",
    "#ffb6c1",
  ];

  const [step, setStep] = useState(0);

  const positions = useMemo(() => {
  const data = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    data[i * 3] = (Math.random() - 0.5) * 8;
    data[i * 3 + 1] = (Math.random() - 0.5) * 8;
    data[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }

  return data;
}, []);

  const velocity = useMemo(() => {
    return new Float32Array(count * 3);
  }, []);

  const [targets, setTargets] = useState(positions);
  const shapes = useMemo(() => {
  return {
    HALLO: createText("HALLO", count),
    SAYANG: createText("SAYANG", count),
    LOVE: createText("I LOVE YOU", count),
    HEART: createHeart(count),
    MWAHH: createText("MWAHH", count),
  };
}, []);

  // ==========================
  // GANTI SHAPE
  // ==========================
useEffect(() => {
  if (gesture) {
    setHandDetected(true);
  }
}, [gesture]);
  useEffect(() => {
    const current = sequence[step];

    if (current.type === "heart") {
      setTargets(createHeart(count));
    } else {
      setTargets(createText(current.value, count));
    }
  }, [step]);

  // ==========================
  // GANTI BERDASARKAN GESTURE
  // ==========================

  useEffect(() => {

    if (gesture === "POINT") {
      setStep(0);
    }

    else if (gesture === "PEACE") {
      setStep(1);
    }

    else if (gesture === "OPEN") {
      setStep(2);
    }

    else if (gesture === "FIST") {
      setStep(3);
    }

  }, [gesture]);
    // ==========================
  // ANIMASI PARTICLE
  // ==========================

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;

    const geometry = pointsRef.current.geometry;
    const array = geometry.attributes.position.array;
    if (!handDetected) {
  geometry.attributes.position.needsUpdate = true;
  return;
}

    const spring = 0.04;
    const damping = 0.90;

    // Posisi jari dari MediaPipe
    const fx = (finger.current.x - 0.5) * 10;
    const fy = -(finger.current.y - 0.5) * 6;

    for (let i = 0; i < count; i++) {
      const id = i * 3;

      // Spring ke target
      velocity[id] += (targets[id] - array[id]) * spring;
      velocity[id + 1] += (targets[id + 1] - array[id + 1]) * spring;
      velocity[id + 2] += (targets[id + 2] - array[id + 2]) * spring;

      // Efek jari hanya saat POINT
      
      velocity[id] *= damping;
      velocity[id + 1] *= damping;
      velocity[id + 2] *= damping;

      array[id] += velocity[id];
      array[id + 1] += velocity[id + 1];
      array[id + 2] += velocity[id + 2];
    }

    geometry.attributes.position.needsUpdate = true;

    // Warna transisi halus
    pointsRef.current.material.color.lerp(
      new THREE.Color(colors[step]),
      0.05
    );

    // Rotasi
    pointsRef.current.rotation.y =
      Math.sin(clock.elapsedTime * 0.25) * 0.12;

    // Floating
    pointsRef.current.position.y =
      Math.sin(clock.elapsedTime * 0.8) * 0.1;

    // Pulse
    pointsRef.current.material.size =
      0.045 + Math.sin(clock.elapsedTime * 3) * 0.01;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        color={new THREE.Color(colors[0])}
        size={0.045}
        transparent
        opacity={1}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}
import { OrbitControls, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import ParticleSystem from "./particles/ParticleSystem";

export default function Experience() {
  return (
    <>
      <color attach="background" args={["#000000"]} />

      <ambientLight intensity={1.5} />

      <pointLight
        position={[5, 5, 5]}
        intensity={8}
        color="#ff66cc"
      />

      <Stars
        radius={250}
        depth={80}
        count={8000}
        factor={5}
        saturation={0}
        fade
        speed={0.5}
      />

      <ParticleSystem />

      <OrbitControls
        enablePan={false}
        enableZoom
      />

      <EffectComposer>
        <Bloom
          intensity={2}
          luminanceThreshold={0}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
    </>
  );
}
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import MusicPlayer from "./MusicPlayer";
import { HandProvider } from "./hand/HandContext";
import HandTracking from "./hand/HandTracking";

export default function App() {
  return (
    <HandProvider>
      <MusicPlayer />

      <Canvas
        style={{
          width: "100vw",
          height: "100vh",
        }}
        camera={{
          position: [0, 0, 12],
          fov: 45,
        }}
      >
        <Experience />
      </Canvas>

      <HandTracking />
    </HandProvider>
  );
}
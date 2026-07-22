import { createContext, useContext, useRef, useState } from "react";

const HandContext = createContext(null);

export function HandProvider({ children }) {
  // Posisi ujung jari telunjuk
  const finger = useRef({
    x: 0.5,
    y: 0.5,
  });

  // Gesture yang sedang terdeteksi
  const [gesture, setGesture] = useState("NONE");

  return (
    <HandContext.Provider
      value={{
        finger,
        gesture,
        setGesture,
      }}
    >
      {children}
    </HandContext.Provider>
  );
}

export function useHand() {
  const context = useContext(HandContext);

  if (!context) {
    throw new Error("useHand harus digunakan di dalam HandProvider");
  }

  return context;
}
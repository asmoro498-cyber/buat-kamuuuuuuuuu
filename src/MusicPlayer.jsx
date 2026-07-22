import { useEffect, useRef } from "react";

export default function MusicPlayer() {
  const audioRef = useRef(null);

  useEffect(() => {
    const startMusic = () => {
      audioRef.current
        ?.play()
        .catch((err) => console.log("Autoplay diblokir:", err));
    };

    window.addEventListener("click", startMusic, { once: true });

    return () => {
      window.removeEventListener("click", startMusic);
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      src="/music/ssstik.io_1784703997807.mp3"
      loop
      hidden
    />
  );
}
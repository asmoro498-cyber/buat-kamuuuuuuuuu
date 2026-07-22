import { useEffect, useRef } from "react";
import Webcam from "react-webcam";
import {
  HandLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

import { useHand } from "./HandContext";

export default function HandTracking() {
  const webcamRef = useRef(null);
  const handLandmarker = useRef(null);
  const animationRef = useRef(null);

  const { finger, setGesture } = useHand();

  useEffect(() => {
    let lastVideoTime = -1;

    async function init() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      handLandmarker.current =
        await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          },
          runningMode: "VIDEO",
          numHands: 1,
        });

      console.log("✅ MediaPipe Ready");

      detect();
    }

    function isFingerUp(landmarks, tip, pip) {
      return landmarks[tip].y < landmarks[pip].y;
    }

    function detect() {
      const video = webcamRef.current?.video;

      if (
        video &&
        video.readyState === 4 &&
        handLandmarker.current
      ) {
        if (lastVideoTime !== video.currentTime) {
          lastVideoTime = video.currentTime;

          const results =
            handLandmarker.current.detectForVideo(
              video,
              performance.now()
            );

          if (results.landmarks.length > 0) {
            const hand = results.landmarks[0];

            // posisi ujung telunjuk
            finger.current = {
              x: hand[8].x,
              y: hand[8].y,
            };

            const indexUp = isFingerUp(hand, 8, 6);
            const middleUp = isFingerUp(hand, 12, 10);
            const ringUp = isFingerUp(hand, 16, 14);
            const pinkyUp = isFingerUp(hand, 20, 18);

            // POINT
            if (
              indexUp &&
              !middleUp &&
              !ringUp &&
              !pinkyUp
            ) {
              setGesture("POINT");
            }

            // PEACE
            else if (
              indexUp &&
              middleUp &&
              !ringUp &&
              !pinkyUp
            ) {
              setGesture("PEACE");
            }

            // OPEN HAND
            else if (
              indexUp &&
              middleUp &&
              ringUp &&
              pinkyUp
            ) {
              setGesture("OPEN");
            }

            // FIST
            else if (
              !indexUp &&
              !middleUp &&
              !ringUp &&
              !pinkyUp
            ) {
              setGesture("FIST");
            }

            else {
              setGesture("NONE");
            }
          } else {
            setGesture("NONE");
          }
        }
      }

      animationRef.current =
        requestAnimationFrame(detect);
    }

    init();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <Webcam
      ref={webcamRef}
      mirrored
      audio={false}
      screenshotFormat="image/jpeg"
      videoConstraints={{
        width: 640,
        height: 480,
        facingMode: "user",
      }}
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        width: 220,
        borderRadius: 12,
        border: "2px solid #ff66cc",
        zIndex: 999,
      }}
    />
  );
}
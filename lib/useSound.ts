"use client";
import { useCallback, useRef } from "react";

export function useClickSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio("/sound/klik.mp3");
        audioRef.current.volume = 0.2;
      }
      // Reset to start so rapid clicks work
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Browser autoplay policy — silently ignore
      });
    } catch {
      // Ignore audio errors
    }
  }, []);

  return play;
}

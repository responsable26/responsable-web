"use client";

import { useEffect, useState } from "react";

const WORDS = ["Rentabilidad", "Resiliencia", "Ventaja Competitiva", "Crecimiento", "Confianza"];
const VISIBLE_MS = 2800;
const FADE_MS = 300;

export function RotatingWord() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let fadeOutTimer: ReturnType<typeof setTimeout>;
    let swapTimer: ReturnType<typeof setTimeout>;

    function scheduleFadeOut() {
      fadeOutTimer = setTimeout(() => {
        setVisible(false);
        swapTimer = setTimeout(() => {
          setIndex((i) => (i + 1) % WORDS.length);
          setVisible(true);
          scheduleFadeOut();
        }, FADE_MS);
      }, VISIBLE_MS);
    }

    scheduleFadeOut();
    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(swapTimer);
    };
  }, []);

  return (
    <span
      className="inline-block transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {WORDS[index]}
    </span>
  );
}

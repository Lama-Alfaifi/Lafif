"use client";

import { useEffect, useState } from "react";

const texts = [
  "اصنع أثرًا",
  "شارك بفعالياتك",
  "طوّر ناديك",
  "ابنِ مجتمعك",
];

export default function LandingAnimatedText() {

  const [textIndex, setTextIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {

    const interval = setInterval(() => {

      setFade(false);

      setTimeout(() => {
        setTextIndex((prev) => (prev + 1) % texts.length);
        setFade(true);
      }, 400);

    }, 3500);

    return () => clearInterval(interval);

  }, []);

  return (
    <p
      className={`
        mt-4 text-cyan-700 text-lg font-medium
        transition-all duration-700
        ${fade
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2"}
      `}
    >
      {texts[textIndex]}
    </p>
  );
}
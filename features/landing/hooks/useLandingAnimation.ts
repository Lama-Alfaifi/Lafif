"use client";

import {
  useEffect,
  useState,
} from "react";

export default function useLandingAnimation(
  texts: string[]
) {

  const [textIndex, setTextIndex] =
    useState(0);

  const [fade, setFade] =
    useState(true);

  useEffect(() => {

    const interval = setInterval(() => {

      setFade(false);

      setTimeout(() => {

        setTextIndex((prev) =>
          (prev + 1) % texts.length
        );

        setFade(true);

      }, 400);

    }, 3500);

    return () => clearInterval(interval);

  }, [texts]);

  return {
    currentText: texts[textIndex],
    fade,
  };

}
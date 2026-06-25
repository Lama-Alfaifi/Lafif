"use client";

import { useEffect, useState } from "react";

export default function LandingTitle() {

  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {

    const timer = setTimeout(() => {
      setShowTitle(true);
    }, 500);

    return () => clearTimeout(timer);

  }, []);

  return (
    <h1
      className={`
        text-7xl font-extrabold text-[#0F172A]
        transition-all duration-1000
        ${showTitle
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-10"}
      `}
    >
      لفيف
    </h1>
  );
}
"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

export default function DashboardPage() {

  const router = useRouter();

  const text = "أهلاً بك في لفيف ✨";

  const [displayedText, setDisplayedText] = useState("");
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {

    let index = 0;

    const typingInterval = setInterval(() => {

      setDisplayedText(text.slice(0, index + 1));

      index++;

      if (index === text.length) {

        clearInterval(typingInterval);

        setTimeout(() => {

          setFadeOut(true);

          setTimeout(() => {

            router.push("/home");

          }, 700);

        }, 300);

      }

    }, 30);

    return () => clearInterval(typingInterval);

  }, []);

  return (
    <main className="min-h-screen bg-[#F8F6F2] flex items-center justify-center overflow-hidden">

      <h1
        className={`
          text-6xl font-extrabold text-[#0F172A]
          transition-all duration-700
          ${fadeOut
            ? "opacity-0 scale-110"
            : "opacity-100 scale-100"}
        `}
      >
        {displayedText}
      </h1>

    </main>
  );
}
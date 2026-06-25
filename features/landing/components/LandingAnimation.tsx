"use client";

import Lottie from "lottie-react";

import animationData
from "@/public/image/animation/login.json";

import {
  useEffect,
  useRef,
} from "react";

export default function LandingAnimation() {

  const lottieRef = useRef<any>(null);

  useEffect(() => {

    lottieRef.current?.setSpeed(0.45);

  }, []);

  return (

    <div
      className="
        relative
        w-[320px]
        md:w-[520px]
        lg:w-[620px]
        flex items-center justify-center
      "
    >

      {/* Glow */}
      <div
        className="
          absolute
          w-[320px]
          h-[320px]
          md:w-[420px]
          md:h-[420px]
          bg-cyan-400/30
          rounded-full
          blur-[120px]
          animate-pulse
        "
      />

      <div
        className="
          absolute
          w-[260px]
          h-[260px]
          md:w-[360px]
          md:h-[360px]
          bg-emerald-400/20
          rounded-full
          blur-[100px]
        "
      />

      {/* Animation */}
      <div className="relative z-10">

        <Lottie
          lottieRef={lottieRef}
          animationData={animationData}
          loop={true}
        />

      </div>

    </div>

  );

}
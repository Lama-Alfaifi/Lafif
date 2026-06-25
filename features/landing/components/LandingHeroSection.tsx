"use client";

import LandingAnimation from "./LandingAnimation";
import LandingTitle from "./LandingTitle";
import LandingSubtitle from "./LandingSubtitle";
import LandingAnimatedText from "./LandingAnimatedText";
import LandingStatistics from "./LandingStatistics";
import LandingLoginButton from "./LandingLoginButton";

export default function LandingHeroSection() {

  return (

    <section
      className="
        relative
        min-h-screen
        overflow-hidden
        flex items-center justify-center
        px-6 md:px-16
      "
    >

      {/* Background Blur */}
      <div
        className="
          absolute
          top-[-200px]
          left-[-200px]
          w-[500px]
          h-[500px]
          bg-cyan-400/30
          rounded-full
          blur-[140px]
        "
      />

      <div
        className="
          absolute
          bottom-[-200px]
          right-[-200px]
          w-[500px]
          h-[500px]
          bg-emerald-400/30
          rounded-full
          blur-[140px]
        "
      />

      {/* Main Content */}
      <div
        className="
          relative z-10
          w-full max-w-[1400px]
          flex flex-col-reverse
          lg:flex-row
          items-center justify-between
          gap-16
        "
      >

        {/* Left Content */}
        <div
          className="
            flex flex-col
            items-start
            text-center lg:text-right
          "
        >

          <LandingTitle />

          <div className="mt-6">
            <LandingSubtitle />
          </div>

          <div className="mt-6">
            <LandingAnimatedText />
          </div>

          <div className="mt-10">
            <LandingStatistics />
          </div>

          <div className="mt-10">
            <LandingLoginButton />
          </div>

        </div>

        {/* Right Animation */}
        <div
          className="
            flex items-center justify-center
          "
        >

          <LandingAnimation />

        </div>

      </div>

    </section>

  );

}
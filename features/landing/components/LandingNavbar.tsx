"use client";

import Link from "next/link";

export default function LandingNavbar() {

  const links = [
    "الرئيسية",
    "الأندية",
    "الفعاليات",
    "تواصل معنا",
  ];

  return (

    <nav
      className="
        fixed top-0 left-0 right-0
        z-50
        px-6 md:px-14
        py-5
      "
    >

      <div
        className="
          max-w-[1400px]
          mx-auto
          flex items-center justify-between
          bg-white/70
          backdrop-blur-2xl
          border border-white/40
          shadow-xl
          rounded-[28px]
          px-8 py-4
        "
      >

        {/* Logo */}
        <h1
          className="
            text-3xl
            font-black
            bg-gradient-to-r
            from-cyan-500
            to-emerald-500
            bg-clip-text
            text-transparent
          "
        >
          لفيف
        </h1>

        {/* Links */}
        <div
          className="
            hidden md:flex
            items-center
            gap-8
          "
        >

          {links.map((link, index) => (

            <button
              key={index}
              className="
                relative
                text-gray-600
                font-semibold
                hover:text-[#0F172A]
                transition-all duration-300
                after:absolute
                after:left-0
                after:-bottom-1
                after:h-[2px]
                after:w-0
                after:bg-cyan-500
                after:transition-all
                hover:after:w-full
              "
            >
              {link}
            </button>

          ))}

        </div>

        {/* Login Button */}
        <Link href="/login">

          <button
            className="
              px-6 py-3
              rounded-2xl
              bg-gradient-to-r
              from-cyan-500
              to-emerald-500
              text-white
              font-bold
              shadow-lg
              hover:scale-105
              active:scale-95
              transition-all duration-300
            "
          >
            تسجيل الدخول
          </button>

        </Link>

      </div>

    </nav>

  );

}
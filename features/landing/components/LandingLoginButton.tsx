"use client";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";

export default function LandingLoginButton() {

  return (

    <Link href="/login">

      <button
        className="
          group
          mt-12
          px-8 py-4
          rounded-[24px]
          text-lg font-bold
          bg-gradient-to-r
          from-cyan-500
          to-emerald-500
          text-white
          shadow-xl shadow-cyan-500/30
          hover:scale-105
          hover:shadow-2xl
          active:scale-95
          transition-all duration-300
          flex items-center gap-3
        "
      >

        <span>
          تسجيل الدخول
        </span>

        <ArrowLeft
          size={22}
          className="
            group-hover:-translate-x-1
            transition-all duration-300
          "
        />

      </button>

    </Link>

  );

}
"use client";

import {
  CalendarDays,
  MapPin,
  Users,
} from "lucide-react";

export default function Card() {

  return (

    <div
      className="
        bg-white
        rounded-[30px]
        overflow-hidden
        shadow-xl
        border border-gray-100
        hover:-translate-y-1
        hover:shadow-2xl
        transition-all duration-300
      "
    >

      {/* Banner */}
      <div
        className="
          relative
          h-52
          bg-gradient-to-br
          from-cyan-500
          via-sky-500
          to-emerald-500
        "
      >

        {/* Overlay */}
        <div
          className="
            absolute inset-0
            bg-black/10
          "
        />

        {/* Status */}
        <div
          className="
            absolute
            top-4 right-4
            px-4 py-2
            rounded-full
            bg-white/20
            backdrop-blur-md
            text-white
            text-sm
            font-bold
          "
        >
          متاح الآن
        </div>

      </div>

      {/* Content */}
      <div className="p-6">

        {/* Category */}
        <div
          className="
            inline-flex
            px-3 py-1
            rounded-full
            bg-cyan-100
            text-cyan-700
            text-xs
            font-bold
          "
        >
          تقنية
        </div>

        {/* Title */}
        <h1
          className="
            mt-4
            text-2xl
            font-black
            text-[#0F172A]
          "
        >
          هاكاثون الأمن السيبراني
        </h1>

        {/* Description */}
        <p
          className="
            mt-3
            text-sm
            text-gray-500
            leading-7
          "
        >

          فعالية تقنية تجمع المبدعين
          لحل التحديات الأمنية
          وبناء حلول مبتكرة.

        </p>

        {/* Info */}
        <div
          className="
            mt-5
            flex flex-col gap-3
          "
        >

          <div className="flex items-center gap-2">

            <CalendarDays
              size={16}
              className="text-cyan-600"
            />

            <span className="text-sm text-gray-600">
              الخميس - 7:00 مساءً
            </span>

          </div>

          <div className="flex items-center gap-2">

            <MapPin
              size={16}
              className="text-emerald-600"
            />

            <span className="text-sm text-gray-600">
              مسرح الجامعة
            </span>

          </div>

          <div className="flex items-center gap-2">

            <Users
              size={16}
              className="text-orange-500"
            />

            <span className="text-sm text-gray-600">
              +120 مشارك
            </span>

          </div>

        </div>

        {/* Button */}
        <button
          className="
            mt-6
            w-full
            py-3
            rounded-2xl
            bg-[#0F172A]
            text-white
            font-bold
            hover:bg-[#1E293B]
            hover:scale-[1.02]
            active:scale-95
            transition-all duration-300
          "
        >
          التسجيل في الفعالية
        </button>

      </div>

    </div>

  );

}
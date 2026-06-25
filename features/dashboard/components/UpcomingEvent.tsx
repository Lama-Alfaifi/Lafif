"use client";

export default function UpcomingEvent() {

  return (

    <div
      className="
        relative
        overflow-hidden
        bg-white
        rounded-[32px]
        shadow-xl
        border border-gray-100
      "
    >

      {/* Banner */}
      <div
        className="
          relative
          h-56
          bg-gradient-to-r
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

        {/* Glow */}
        <div
          className="
            absolute
            -bottom-10
            left-10
            w-40 h-40
            bg-white/20
            rounded-full
            blur-3xl
          "
        />

      </div>

      {/* Content */}
      <div className="p-7">

        {/* Status */}
        <div
          className="
            inline-flex
            items-center gap-2
            px-4 py-2
            rounded-full
            bg-red-100
            text-red-500
            text-sm
            font-bold
          "
        >

          <div
            className="
              w-2 h-2
              rounded-full
              bg-red-500
              animate-pulse
            "
          />

          قريباً

        </div>

        {/* Title */}
        <h1
          className="
            text-3xl
            font-black
            text-[#0F172A]
            mt-5
            leading-tight
          "
        >
          ورشة الأمن السيبراني
        </h1>

        {/* Description */}
        <p
          className="
            text-gray-500
            mt-4
            leading-8
            text-[15px]
          "
        >

          تعلّم أساسيات الأمن السيبراني
          واكتشف طرق حماية الأنظمة
          من الهجمات الإلكترونية.

        </p>

        {/* Bottom */}
        <div
          className="
            flex items-center justify-between
            mt-8
            gap-4
          "
        >

          {/* Date */}
          <div>

            <p
              className="
                text-gray-400
                text-sm
              "
            >
              التاريخ
            </p>

            <h1
              className="
                font-bold
                mt-1
                text-[#0F172A]
              "
            >
              غداً - 7:00 مساءً
            </h1>

          </div>

          {/* Button */}
          <button
            className="
              px-6 py-3
              rounded-2xl
              bg-[#0F172A]
              text-white
              font-bold
              shadow-lg
              hover:scale-105
              hover:bg-[#1E293B]
              active:scale-95
              transition-all duration-300
            "
          >
            تسجيل
          </button>

        </div>

      </div>

    </div>

  );

}
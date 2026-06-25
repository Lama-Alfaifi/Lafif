"use client";

export default function Card() {

  return (

    <div
      className="
        bg-white
        rounded-[32px]
        overflow-hidden
        shadow-xl
        hover:-translate-y-2
        transition-all duration-500
      "
    >

      <div
        className="
          h-56
          bg-gradient-to-br
          from-cyan-500
          to-emerald-500
        "
      />

      <div className="p-6">

        <h1
          className="
            text-3xl
            font-black
            text-[#0F172A]
          "
        >
          نادي الحاسب
        </h1>

        <p className="text-gray-500 mt-3">

          كلية الحاسب وتقنية المعلومات

        </p>

        <div
          className="
            flex items-center justify-between
            mt-8
          "
        >

          <div>

            <h1 className="font-black text-2xl">
              540
            </h1>

            <p className="text-gray-400 text-sm">
              عضو
            </p>

          </div>

          <button
            className="
              px-5 py-3 rounded-2xl
              bg-[#0F172A]
              text-white
              hover:scale-105
              transition-all
            "
          >
            انضمام
          </button>

        </div>

      </div>

    </div>

  );

}
"use client";

export default function Statistics() {

  return (

    <div
      className="
        grid grid-cols-3
        gap-5
      "
    >

      <div
        className="
          bg-white
          rounded-[32px]
          p-7
          shadow-xl
        "
      >

        <h1
          className="
            text-5xl
            font-black
            text-cyan-500
          "
        >
          24
        </h1>

        <p className="mt-3 text-gray-500">
          نادي
        </p>

      </div>

      <div
        className="
          bg-white
          rounded-[32px]
          p-7
          shadow-xl
        "
      >

        <h1
          className="
            text-5xl
            font-black
            text-emerald-500
          "
        >
          120
        </h1>

        <p className="mt-3 text-gray-500">
          فعالية
        </p>

      </div>

      <div
        className="
          bg-white
          rounded-[32px]
          p-7
          shadow-xl
        "
      >

        <h1
          className="
            text-5xl
            font-black
            text-red-500
          "
        >
          2K
        </h1>

        <p className="mt-3 text-gray-500">
          عضو
        </p>

      </div>

    </div>

  );

}
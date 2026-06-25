"use client";

export default function ActivityCard() {

  return (

    <div
      className="
        bg-white
        rounded-[28px]
        p-5
        shadow-xl
      "
    >

      <h1
        className="
          text-2xl
          font-black
          text-[#0F172A]
        "
      >
        نشاطك الأخير
      </h1>

      <div className="mt-6 flex flex-col gap-4">

        <div
          className="
            bg-gray-50
            rounded-2xl
            p-4
          "
        >

          <p className="font-bold">
            انضممت إلى نادي الحاسب
          </p>

          <span
            className="
              text-xs
              text-gray-500
            "
          >
            قبل ساعتين
          </span>

        </div>

        <div
          className="
            bg-gray-50
            rounded-2xl
            p-4
          "
        >

          <p className="font-bold">
            سجلت في هاكاثون الجامعة
          </p>

          <span
            className="
              text-xs
              text-gray-500
            "
          >
            أمس
          </span>

        </div>

      </div>

    </div>

  );

}
"use client";

const days = [
  "أحد",
  "اثنين",
  "ثلاثاء",
  "أربعاء",
  "خميس",
  "جمعة",
  "سبت",
];

export default function ClubCalendar() {

  return (

    <div
      className="
        bg-white
        rounded-[32px]
        p-6
        shadow-xl
      "
    >

      <h1
        className="
          text-3xl font-black
          text-[#0F172A]
        "
      >
        التقويم
      </h1>

      <div
        className="
          grid grid-cols-7
          gap-3 mt-8
        "
      >

        {days.map((day, index) => (

          <div
            key={index}
            className="
              text-center
              text-sm
              text-gray-400
              font-bold
            "
          >
            {day}
          </div>

        ))}

        {Array.from({ length: 30 }).map((_, index) => (

          <button
            key={index}
            className={`
              h-14 rounded-2xl
              font-bold
              transition-all
              hover:scale-105
              ${index === 10
                ? "bg-cyan-500 text-white"
                : "bg-gray-50"}
            `}
          >
            {index + 1}
          </button>

        ))}

      </div>

    </div>

  );

}
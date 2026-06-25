"use client";

const activities = [
  "ورشة تصميم",
  "بطولة ألعاب",
  "فعالية ثقافية",
];

export default function Activities() {

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
          text-3xl
          font-black
          text-[#0F172A]
        "
      >
        النشاطات
      </h1>

      <div className="mt-8 flex flex-col gap-4">

        {activities.map((activity, index) => (

          <div
            key={index}
            className="
              p-5 rounded-2xl
              bg-gray-50
              hover:bg-cyan-50
              transition-all
            "
          >

            <h1 className="font-bold">
              {activity}
            </h1>

          </div>

        ))}

      </div>

    </div>

  );

}
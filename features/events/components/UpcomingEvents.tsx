"use client";

const events = [
  "هاكاثون الحاسب",
  "ورشة التصميم",
  "بطولة الشطرنج",
];

export default function UpcomingEvents() {

  return (

    <div>

      <h1
        className="
          text-4xl font-black
          text-[#0F172A]
          mb-8
        "
      >
        الفعاليات القادمة
      </h1>

      <div
        className="
          flex gap-6
          overflow-x-auto
          pb-4
        "
      >

        {events.map((event, index) => (

          <div
            key={index}
            className="
              min-w-[320px]
              bg-white
              rounded-[32px]
              overflow-hidden
              shadow-xl
              flex-shrink-0
            "
          >

            <div
              className="
                h-48
                bg-gradient-to-r
                from-cyan-500
                to-emerald-500
              "
            />

            <div className="p-6">

              <h1
                className="
                  text-2xl font-black
                  text-[#0F172A]
                "
              >
                {event}
              </h1>

              <button
                className="
                  mt-6
                  px-5 py-3 rounded-2xl
                  bg-[#0F172A]
                  text-white
                "
              >
                تسجيل
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}
"use client";

import { useEffect, useState } from "react";

const clubs = [
  {
    name: "نادي الحاسب",
    description: "برمجة وذكاء اصطناعي",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
  },

  {
    name: "نادي الأدب",
    description: "قصص وشعر وفعاليات ثقافية",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794",
  },

  {
    name: "نادي الأعمال",
    description: "ريادة أعمال وتطوير مهني",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  },
];

export default function ClubSlider() {

  const [active, setActive] = useState(1);

  useEffect(() => {

    const interval = setInterval(() => {

      setActive((prev) =>
        prev === clubs.length - 1 ? 0 : prev + 1
      );

    }, 5000);

    return () => clearInterval(interval);

  }, []);

  return (

    <div className="mt-14">

      <h1 className="text-3xl font-bold text-[#0F172A] mb-8">
        الأندية الجامعية
      </h1>

      <div
        className="
          flex items-center justify-center gap-8
        "
      >

        {clubs.map((club, index) => {

          const isActive = index === active;

          return (

            <div
              key={index}
              className={`
                rounded-3xl overflow-hidden
                transition-all duration-700
                shadow-xl bg-white
                flex flex-col
                ${isActive
                  ? "w-[380px] scale-105"
                  : "w-[300px] opacity-70 scale-95"}
              `}
            >

              {/* Image */}
              <img
                src={club.image}
                alt={club.name}
                className="
                  w-full h-[220px]
                  object-cover
                "
              />

              {/* Content */}
              <div className="p-6">

                <h2 className="text-3xl font-bold text-[#0F172A]">
                  {club.name}
                </h2>

                <p className="mt-3 text-gray-500">
                  {club.description}
                </p>

                <button
                  className="
                    mt-6
                    px-5 py-3 rounded-2xl
                    bg-gradient-to-r
                    from-cyan-500 to-emerald-500
                    text-white font-semibold
                    hover:scale-105
                    transition
                  "
                >
                  انضم الآن
                </button>

              </div>

            </div>

          );

        })}

      </div>

    </div>

  );
}
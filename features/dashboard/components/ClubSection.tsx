"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Club = {
  id: string;
  name: string;
  college?: string;
};

type ClubSectionProps = {
  title: string;
  clubs: Club[];
};

export default function ClubSection({
  title,
  clubs,
}: ClubSectionProps) {

  const [items, setItems] = useState(clubs);

  useEffect(() => {

    const interval = setInterval(() => {

      setItems((prev) => {

        const updated = [...prev];

        const first = updated.shift();

        if (first) {
          updated.push(first);
        }

        return updated;

      });

    }, 5000);

    return () => clearInterval(interval);

  }, []);

  // نعرض 5 عناصر فقط
  const visibleItems = items.slice(0, 5);

  // العنصر الأوسط
  const centerIndex = 2;

  return (

    <div className="mt-16 overflow-hidden py-8">

      {/* Title */}
      <h1
        className="
          text-3xl md:text-4xl
          font-bold
          text-[#0F172A]
          mb-10
          text-center
        "
      >
        {title}
      </h1>

      {/* Cards */}
      <div
        className="
          relative
          flex items-center justify-center
          gap-6 md:gap-8
          px-4
        "
      >

        {visibleItems.map((club, index) => {

          const isCenter = index === centerIndex;

          const distance =
            Math.abs(index - centerIndex);

          const scale =
            isCenter ? 1 : 1 - distance * 0.08;

          const opacity =
            isCenter ? 1 : 1 - distance * 0.18;

          const zIndex = 10 - distance;

          return (

            <div
              key={`${club.name}-${index}`}
              className={`
                flex-shrink-0
                rounded-3xl
                overflow-hidden
                bg-white
                shadow-xl
                cursor-pointer
                transition-all will-change-transform
                duration-[2200ms]
                ease-[cubic-bezier(0.22,1,0.36,1)]
                hover:shadow-2xl
                ${isCenter
                  ? "shadow-2xl"
                  : ""}
              `}
              style={{
                width: isCenter
                  ? "260px"
                  : `${230 - distance * 15}px`,

                height: isCenter
                  ? "340px"
                  : `${310 - distance * 15}px`,

                transform: `
                  scale(${scale})
                  translateY(${isCenter
                    ? "-10px"
                    : "0px"})
                `,

                opacity,

                zIndex,
              }}
            >

              {/* Image */}
              <div
                className="
                  w-full
                  bg-gradient-to-br
                  from-cyan-500
                  to-emerald-500
                  transition-all duration-1000
                "
                style={{
                  height: isCenter
                    ? "150px"
                    : "130px",
                }}
              />

              {/* Content */}
              <div className="p-5">

                <h2
                  className={`
                    font-bold
                    text-[#0F172A]
                    transition-all duration-1000
                    leading-snug
                    line-clamp-2
                    ${isCenter
                      ? "text-xl"
                      : "text-lg"}
                  `}
                >
                  {club.name}
                </h2>

                {club.college && (

                  <p
                    className={`
                      mt-3
                      text-gray-500
                      transition-all duration-1000
                      line-clamp-2
                      ${isCenter
                        ? "text-sm"
                        : "text-xs"}
                    `}
                  >
                    {club.college}
                  </p>

                )}

                <Link
                  href={`/clubs/${club.id}`}
                >

                  <button
                    className={`
                      mt-5
                      rounded-full
                      bg-[#0F172A]
                      text-white
                      font-semibold
                      hover:bg-[#1e293b]
                      hover:scale-105
                      active:scale-95
                      transition-all duration-300
                      ${isCenter
                        ? "px-5 py-2.5 text-sm"
                        : "px-4 py-2 text-xs"}
                    `}
                  >
                    انضمام
                  </button>

                </Link>

              </div>

            </div>

          );

        })}

      </div>

    </div>

  );

}
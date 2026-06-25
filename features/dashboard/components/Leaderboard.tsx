"use client";

import {
  Trophy,
  Flame,
} from "lucide-react";

const clubs = [

  {
    name: "نادي الحاسب",
    points: 920,
  },

  {
    name: "نادي الطب",
    points: 870,
  },

  {
    name: "نادي الهندسة",
    points: 820,
  },

  {
    name: "نادي التصميم",
    points: 760,
  },

];

export default function Leaderboard() {

  return (

    <div
      className="
        bg-white
        rounded-[28px]
        p-5
        shadow-xl
      "
    >

      {/* Header */}
      <div
        className="
          flex items-center justify-between
        "
      >

        <h1
          className="
            text-2xl
            font-black
            text-[#0F172A]
          "
        >
          الأكثر نشاطًا
        </h1>

        <div
          className="
            w-10 h-10
            rounded-2xl
            bg-orange-100
            flex items-center justify-center
          "
        >

          <Trophy
            size={20}
            className="text-orange-500"
          />

        </div>

      </div>

      {/* Clubs */}
      <div className="mt-6 flex flex-col gap-3">

        {clubs.map((club, index) => (

          <div
            key={index}
            className="
              flex items-center justify-between
              bg-gray-50
              rounded-2xl
              p-4
              hover:bg-gray-100
              transition-all duration-300
            "
          >

            {/* Left */}
            <div className="flex items-center gap-3">

              {/* Rank */}
              <div
                className="
                  w-10 h-10
                  rounded-xl
                  bg-gradient-to-br
                  from-cyan-500
                  to-emerald-500
                  text-white
                  flex items-center justify-center
                  font-black
                "
              >
                {index + 1}
              </div>

              {/* Club */}
              <div>

                <h1
                  className="
                    font-bold
                    text-[#0F172A]
                  "
                >
                  {club.name}
                </h1>

                <p
                  className="
                    text-xs
                    text-gray-500
                    mt-1
                  "
                >
                  نادي نشط
                </p>

              </div>

            </div>

            {/* Points */}
            <div
              className="
                flex items-center gap-2
                text-orange-500
                font-bold
              "
            >

              <Flame size={16} />

              <span>
                {club.points}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}
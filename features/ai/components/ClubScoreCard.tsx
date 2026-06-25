"use client";

import scoringService
from "../services/scoring.service";

export default function
ClubScoreCard() {

  const clubs =
    scoringService();

  return (

    <div
      className="
        bg-white
        rounded-[32px]
        p-7
        shadow-xl
      "
    >

      {/* Header */}
      <div
        className="
          flex items-center
          justify-between
        "
      >

        <div>

          <p
            className="
              text-sm
              text-amber-500
              font-bold
            "
          >
            AI Leaderboard
          </p>

          <h1
            className="
              text-2xl
              font-black
              mt-2
              text-[#0F172A]
            "
          >
            ترتيب الأندية الذكي
          </h1>

        </div>

        <div
          className="
            px-4 py-2
            rounded-full
            bg-amber-100
            text-amber-700
            text-sm
            font-bold
          "
        >
          Weekly Ranking
        </div>

      </div>

      {/* Clubs */}
      <div
        className="
          mt-8
          flex flex-col
          gap-4
        "
      >

        {clubs.map(

          (
            club,
            index
          ) => (

            <div
              key={index}
              className="
                flex items-center
                justify-between
                bg-gray-50
                rounded-2xl
                p-4
              "
            >

              <div
                className="
                  flex items-center
                  gap-4
                "
              >

                <div
                  className="
                    w-10 h-10
                    rounded-full
                    bg-[#0F172A]
                    text-white
                    flex items-center
                    justify-center
                    font-bold
                  "
                >
                  {index + 1}
                </div>

                <div>

                  <h1
                    className="
                      font-black
                      text-[#0F172A]
                    "
                  >
                    {club.club}
                  </h1>

                  <p
                    className="
                      text-xs
                      text-gray-500
                      mt-1
                    "
                  >
                    التفاعل:
                    {" "}
                    {club.engagement}%
                  </p>

                </div>

              </div>

              <div
                className="
                  text-right
                "
              >

                <h1
                  className="
                    text-2xl
                    font-black
                    text-cyan-600
                  "
                >
                  {club.xp}
                </h1>

                <p
                  className="
                    text-xs
                    text-gray-400
                  "
                >
                  XP
                </p>

              </div>

            </div>

          )

        )}

      </div>

    </div>

  );

}
"use client";

import useLeaderboard
from "@/features/ai/hooks/useLeaderboard";

export default function
Leaderboard() {

  const clubs =
    useLeaderboard();

  return (

    <div
      className="
        bg-white
        rounded-[32px]
        p-7
        shadow-xl
      "
    >

      <div
        className="
          flex
          items-center
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
            AI Ranking
          </p>

          <h1
            className="
              text-2xl
              font-black
              mt-2
              text-[#0F172A]
            "
          >
            ترتيب الأندية
          </h1>

        </div>

      </div>

      <div
        className="
          mt-7
          flex
          flex-col
          gap-4
        "
      >

        {

          clubs.map(

            (

              club: any,

              index: number

            ) => (

              <div
                key={club.id}
                className="
                  flex
                  items-center
                  justify-between
                  bg-gray-50
                  rounded-2xl
                  p-4
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-4
                  "
                >

                  <div
                    className="
                      w-10
                      h-10
                      rounded-full
                      bg-[#0F172A]
                      text-white
                      flex
                      items-center
                      justify-center
                      font-black
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
                      {club.name}
                    </h1>

                    <p
                      className="
                        text-sm
                        text-gray-500
                        mt-1
                      "
                    >
                      {

                        club.type ===
                        "central"

                        ? "نادي مركزي"

                        : "نادي لامركزي"

                      }
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
                      text-emerald-500
                    "
                  >
                    {club.score}
                  </h1>

                  <p
                    className="
                      text-xs
                      text-gray-400
                    "
                  >
                    AI Score
                  </p>

                </div>

              </div>

            )

          )

        }

      </div>

    </div>

  );

}
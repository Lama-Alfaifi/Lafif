"use client";

import useChallenges
from "../hooks/useChallenges";

export default function
ChallengeHistoryCard() {

  const {

    challenges,

    loading,

  } = useChallenges();

  if (loading) {

    return (

      <div
        className="
          bg-white
          rounded-[32px]
          p-7
          shadow-xl
        "
      >
        جاري تحميل التحديات...
      </div>

    );

  }

  return (

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
          text-2xl
          font-black
          text-[#0F172A]
        "
      >
        سجل التحديات
      </h1>

      <div
        className="
          mt-6
          flex
          flex-col
          gap-4
        "
      >

        {

          challenges.map(

            (challenge) => (

              <div
                key={challenge.id}
                className="
                  bg-gray-50
                  rounded-2xl
                  p-5
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >

                  <h1
                    className="
                      font-black
                      text-lg
                    "
                  >
                    {challenge.title}
                  </h1>

                  <span
                    className="
                      text-cyan-600
                      font-bold
                    "
                  >
                    {challenge.points}
                    XP
                  </span>

                </div>

                <p
                  className="
                    text-sm
                    text-gray-500
                    mt-2
                  "
                >
                  {challenge.club}
                </p>

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    mt-4
                  "
                >

                  <span
                    className="
                      bg-cyan-100
                      text-cyan-700
                      px-3
                      py-1
                      rounded-full
                      text-xs
                    "
                  >
                    {challenge.difficulty}
                  </span>

                  <span
                    className="
                      bg-emerald-100
                      text-emerald-700
                      px-3
                      py-1
                      rounded-full
                      text-xs
                    "
                  >
                    {challenge.challengeType}
                  </span>

                </div>

              </div>

            )

          )

        }

      </div>

    </div>

  );

}
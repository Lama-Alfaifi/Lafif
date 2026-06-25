"use client";

import {
  Trophy,
  Users,
} from "lucide-react";

export default function ProfileCard() {

  return (

    <div
      className="
        relative
        overflow-hidden
        bg-white
        rounded-[28px]
        p-5
        shadow-xl
      "
    >

      {/* User */}
      <div className="flex items-center gap-4">

        {/* Avatar */}
        <div
          className="
            w-16 h-16 rounded-full
            bg-gradient-to-br
            from-cyan-500
            to-emerald-500
            flex items-center justify-center
            text-white
            text-xl
            font-black
            shadow-lg
          "
        >
          م
        </div>

        {/* Info */}
        <div>

          <h1
            className="
              text-xl
              font-black
              text-[#0F172A]
            "
          >
            المستخدم
          </h1>

          <p
            className="
              text-sm
              text-gray-500
              mt-1
            "
          >
            كلية الحاسب
          </p>

          <div
            className="
              mt-2
              inline-flex
              items-center gap-2
              px-3 py-1
              rounded-full
              bg-emerald-100
              text-emerald-600
              text-xs
              font-bold
            "
          >
            <Trophy size={12} />
            عضو نشط
          </div>

        </div>

      </div>

      {/* Stats */}
      <div
        className="
          mt-5
          grid grid-cols-2 gap-3
        "
      >

        {/* Clubs */}
        <div
          className="
            bg-gray-50
            rounded-2xl
            p-4
            transition-all duration-300
            hover:bg-cyan-50
          "
        >

          <div className="flex items-center gap-2">

            <div
              className="
                w-10 h-10 rounded-xl
                bg-cyan-100
                flex items-center justify-center
              "
            >
              <Users
                size={18}
                className="text-cyan-600"
              />
            </div>

            <div>

              <h1
                className="
                  text-2xl
                  font-black
                  text-[#0F172A]
                "
              >
                12
              </h1>

              <p className="text-xs text-gray-500">
                نادي
              </p>

            </div>

          </div>

        </div>

        {/* Events */}
        <div
          className="
            bg-gray-50
            rounded-2xl
            p-4
            transition-all duration-300
            hover:bg-emerald-50
          "
        >

          <div className="flex items-center gap-2">

            <div
              className="
                w-10 h-10 rounded-xl
                bg-emerald-100
                flex items-center justify-center
              "
            >
              <Trophy
                size={18}
                className="text-emerald-600"
              />
            </div>

            <div>

              <h1
                className="
                  text-2xl
                  font-black
                  text-[#0F172A]
                "
              >
                38
              </h1>

              <p className="text-xs text-gray-500">
                فعالية
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}
"use client";

import {
  Plus,
  Calendar,
  Users,
} from "lucide-react";

const actions = [

  {
    title: "إنشاء فعالية",
    icon: Plus,
  },

  {
    title: "الفعاليات",
    icon: Calendar,
  },

  {
    title: "الأندية",
    icon: Users,
  },

];

export default function QuickActions() {

  return (

    <div
      className="
        bg-white
        rounded-[28px]
        p-5
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
        اختصارات
      </h1>

      <div
        className="
          mt-5
          grid grid-cols-3
          gap-3
        "
      >

        {actions.map((action, index) => {

          const Icon = action.icon;

          return (

            <button
              key={index}
              className="
                bg-gray-50
                rounded-2xl
                p-4
                flex flex-col
                items-center justify-center
                gap-3
                hover:bg-cyan-50
                hover:scale-105
                transition-all duration-300
              "
            >

              <div
                className="
                  w-12 h-12
                  rounded-2xl
                  bg-gradient-to-br
                  from-cyan-500
                  to-emerald-500
                  text-white
                  flex items-center justify-center
                "
              >

                <Icon size={22} />

              </div>

              <p
                className="
                  text-sm
                  font-bold
                  text-[#0F172A]
                "
              >
                {action.title}
              </p>

            </button>

          );

        })}

      </div>

    </div>

  );

}
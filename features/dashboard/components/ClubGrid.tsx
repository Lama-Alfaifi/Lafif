"use client";
import Link from "next/link";
import { useLanguage } from "@/features/i18n/context/LanguageContext";

type Club = {
  id: string;
  name: string;
  college?: string;
};

type ClubGridProps = {
  title: string;
  clubs: Club[];
};

export default function ClubGrid({ title, clubs }: ClubGridProps) {
  const { t } = useLanguage();
  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-bold text-[#7C3AED]">
            Lafif Clubs
          </p>

          <h2 className="text-xl font-black text-[#21166A]">
            {title}
          </h2>
        </div>

        <span className="px-3 py-1.5 rounded-full bg-white text-[#21166A] text-xs font-bold shadow-sm">
          {clubs.length} {t.dashboard.clubCount}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {clubs.map((club, index) => (
          <Link
            key={club.id}
            href={`/clubs/${club.id}`}
            className="
              group
              relative
              h-[210px]
              rounded-[28px]
              bg-white
              p-5
              shadow-md
              border border-white
              hover:shadow-xl
              hover:-translate-y-1
              transition-all
              overflow-hidden
              flex
              flex-col
              justify-between
            "
          >
            <div className="absolute -top-10 -left-10 w-28 h-28 rounded-full bg-purple-200/40 blur-2xl" />

            <div className="absolute -bottom-10 -right-10 w-28 h-28 rounded-full bg-emerald-200/45 blur-2xl" />

            <div className="relative z-10">
              <div
                className="
                  w-12 h-12
                  rounded-2xl
                  bg-gradient-to-br
                  from-[#7C3AED]
                  to-[#22C55E]
                  text-white
                  flex items-center justify-center
                  font-black
                  text-base
                  mb-4
                  group-hover:scale-105
                  transition
                "
              >
                {index + 1}
              </div>

              <h3
                className="
                  text-[14px]
                  font-black
                  text-[#21166A]
                  leading-5
                  min-h-[42px]
                  line-clamp-2
                "
              >
                {club.name}
              </h3>

              <p
                className="
                  mt-1
                  text-[11px]
                  text-[#6B7280]
                  leading-4
                  min-h-[20px]
                  line-clamp-1
                "
              >
                {club.college || t.dashboard.decentFallback}
              </p>
            </div>

            <div className="relative z-10 pt-2 pb-1">
              <span
                className="
                  inline-flex
                  items-center
                  justify-center
                  px-3
                  py-1.5
                  rounded-full
                  bg-[#21166A]
                  text-white
                  text-[10px]
                  font-bold
                "
              >
                {t.dashboard.viewClub}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );

}
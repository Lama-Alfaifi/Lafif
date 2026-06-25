import type { EventItem } from "../types/event.types";

type PublicClubsCardProps = {
  events: EventItem[];
};

export default function PublicClubsCard({
  events,
}: PublicClubsCardProps) {
  const publicClubs = [
    ...new Set(
      events
        .filter((event) => event.type === "public")
        .map((event) => event.clubName)
        .filter(Boolean)
    ),
  ];

  return (
    <div className="bg-white rounded-[30px] p-5 shadow-lg">
      <h2 className="text-xl font-black text-[#21166A] mb-5">
        أندية لديها ورش عامة
      </h2>

      <div className="space-y-3">
        {publicClubs.length === 0 && (
          <p className="text-sm text-gray-400">
            لا توجد ورش عامة حاليًا
          </p>
        )}

        {publicClubs.map((club) => (
          <div
            key={club}
            className="
              flex items-center justify-between
              rounded-2xl
              bg-[#F8F6FC]
              border border-[#EEE7F8]
              px-4 py-3
            "
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />

            <p className="text-sm font-bold text-[#21166A]">
              {club}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
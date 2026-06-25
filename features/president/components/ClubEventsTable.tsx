"use client";

import useClubEvents from "../hooks/useClubEvents";

type ClubEventsTableProps = {
  clubId: string;
  onSelectEvent?: (eventId: string) => void;
};

export default function ClubEventsTable({
  clubId,
  onSelectEvent,
}: ClubEventsTableProps) {
  const { events, loading } =
    useClubEvents(clubId);

  if (loading) {
    return (
      <div className="bg-white rounded-[30px] p-5 shadow-lg">
        جاري تحميل الفعاليات...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[30px] p-5 shadow-lg mt-6">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">
          جميع فعاليات النادي
        </p>

        <h2 className="text-xl font-black text-[#21166A]">
          الفعاليات
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-[#EEE7F8]">
              <th className="pb-3 text-sm text-gray-400">
                الفعالية
              </th>
              <th className="pb-3 text-sm text-gray-400">
                التاريخ
              </th>
              <th className="pb-3 text-sm text-gray-400">
                الوقت
              </th>
              <th className="pb-3 text-sm text-gray-400">
                النوع
              </th>
              <th className="pb-3 text-sm text-gray-400">
                الحضور
              </th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => (
              <tr
                key={event.id}
                className="border-b border-[#F3F0FA] hover:bg-[#F8F6FC] transition"
              >
                <td className="py-4 font-bold text-[#21166A]">
                  {event.title}
                </td>

                <td className="py-4 text-sm text-gray-500">
                  {event.day}/{event.month}/{event.year}
                </td>

                <td className="py-4 text-sm text-gray-500">
                  {event.time}
                </td>

                <td className="py-4">
                  <span
                    className={`
                      px-3 py-1
                      rounded-full
                      text-xs
                      font-bold
                      ${
                        event.type === "public"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-red-100 text-red-500"
                      }
                    `}
                  >
                    {event.type === "public"
                      ? "عامة"
                      : "للأعضاء"}
                  </span>
                </td>

                <td className="py-4">
                  <button
                    onClick={() =>
                      onSelectEvent?.(event.id)
                    }
                    className="
                      px-4 py-2
                      rounded-xl
                      bg-[#21166A]
                      text-white
                      text-xs
                      font-bold
                    "
                  >
                    عرض الحضور
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {events.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-6">
            لا توجد فعاليات لهذا النادي حالياً.
          </p>
        )}
      </div>
    </div>
  );
}
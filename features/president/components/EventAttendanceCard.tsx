"use client";

import useEventAttendance from "../hooks/useEventAttendance";

type EventAttendanceCardProps = {
  eventId?: string;
  universityId?: string;
};

export default function EventAttendanceCard({
  eventId,
  universityId,
}: EventAttendanceCardProps) {
  const { attendance, loading } =
    useEventAttendance(eventId, universityId);

  return (
    <div className="bg-white rounded-[30px] p-5 shadow-lg mt-6">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">
          {attendance.length} حاضر
        </p>

        <h2 className="text-xl font-black text-[#21166A]">
          حضور الفعالية
        </h2>
      </div>

      {!eventId && (
        <p className="text-sm text-gray-500">
          اختاري فعالية من الجدول لعرض الحضور.
        </p>
      )}

      {loading && (
        <p className="text-sm text-gray-500">
          جاري تحميل الحضور...
        </p>
      )}

      {!loading && eventId && attendance.length === 0 && (
        <p className="text-sm text-gray-500">
          لا يوجد حضور مسجل لهذه الفعالية.
        </p>
      )}

      <div className="space-y-3">
        {attendance.map((item) => (
          <div
            key={item.id}
            className="
              flex items-center justify-between
              rounded-2xl
              border border-[#EEE7F8]
              bg-[#F8F6FC]
              px-4 py-3
            "
          >
            <span className="text-xs text-gray-400">
              {item.userId}
            </span>

            <div className="text-right">
              <p className="text-sm font-bold text-[#21166A]">
                {item.userName || "مستخدم"}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {item.userEmail || "لا يوجد بريد"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
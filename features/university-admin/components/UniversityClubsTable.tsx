"use client";

type Club = {
  id: string;
  name?: string;
  college?: string;
  category?: "central" | "decentralized";
  email?: string;
};

type UniversityClubsTableProps = {
  clubs: Club[];
  loading: boolean;
};

export default function UniversityClubsTable({
  clubs,
  loading,
}: UniversityClubsTableProps) {
  if (loading) {
    return (
      <p className="text-sm text-gray-500">
        جاري تحميل الأندية...
      </p>
    );
  }

  return (
    <div className="bg-white rounded-[30px] p-5 shadow-lg mt-6">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">
          {clubs.length} نادي
        </p>

        <h2 className="text-xl font-black text-[#21166A]">
          أندية الجامعة
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-[#EEE7F8]">
              <th className="pb-3 text-sm text-gray-400">
                النادي
              </th>

              <th className="pb-3 text-sm text-gray-400">
                الكلية
              </th>

              <th className="pb-3 text-sm text-gray-400">
                النوع
              </th>

              <th className="pb-3 text-sm text-gray-400">
                البريد
              </th>
            </tr>
          </thead>

          <tbody>
            {clubs.map((club) => (
              <tr
                key={club.id}
                className="border-b border-[#F3F0FA]"
              >
                <td className="py-4 font-bold text-[#21166A]">
                  {club.name || "بدون اسم"}
                </td>

                <td className="py-4 text-sm text-gray-500">
                  {club.college || "غير محدد"}
                </td>

                <td className="py-4">
                  <span className="px-3 py-1 rounded-full bg-[#F3F0FA] text-[#21166A] text-xs font-bold">
                    {club.category === "decentralized"
                      ? "لامركزي"
                      : "مركزي"}
                  </span>
                </td>

                <td className="py-4 text-sm text-gray-500">
                  {club.email || "لا يوجد"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {clubs.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-8">
            لا توجد أندية مضافة حالياً.
          </p>
        )}
      </div>
    </div>
  );
}
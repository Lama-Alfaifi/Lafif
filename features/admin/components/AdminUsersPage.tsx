"use client";

import Sidebar from "@/features/dashboard/components/Sidebar";

import useUsers from "../hooks/useUsers";
import useAdminClubs from "../hooks/useAdminClubs";

import {
  assignPresident,
  removePresidentRole,
} from "../services/users.service";

export default function AdminUsersPage() {
  const { users, loading, loadUsers } = useUsers();

  const roleLabels: Record<string, string> = {
    superAdmin: "سوبر أدمن",
    universityAdmin: "أدمن جامعة",
    president: "رئيس نادي",
    vicePresident: "نائب الرئيس",
    member: "عضو",
    student: "طالب",
  };

  const usersByUniversity = users.reduce<Record<string, typeof users>>(
    (acc, user) => {
      const key = user.universityId || "unknown";
      if (!acc[key]) acc[key] = [];
      acc[key].push(user);
      return acc;
    },
    {}
  );

  async function handleAssignPresident(
    userId: string,
    clubId: string,
    clubName: string
  ) {
    await assignPresident(userId, clubId, clubName);
    loadUsers();
  }

  async function handleRemovePresident(userId: string) {
    await removePresidentRole(userId);
    loadUsers();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#EFE8F7] flex items-center justify-center">
        <p className="font-bold text-[#21166A]">
          جاري تحميل المستخدمين...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#EFE8F7] p-5 overflow-hidden">
      <div className="flex h-[calc(100vh-40px)] rounded-[36px] bg-white/60 backdrop-blur-xl border border-white/80 shadow-2xl overflow-hidden">
        <section className="flex-1 h-full overflow-y-auto p-7">
          <div className="text-right mb-7">
            <h1 className="text-3xl font-black text-[#21166A]">
              إدارة المستخدمين
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              تعيين رؤساء الأندية وإدارة الصلاحيات من داخل المنصة
            </p>
          </div>

          {Object.entries(usersByUniversity).map(([universityId, uniUsers]) => (
            <UniversityUsersTable
              key={universityId}
              universityId={universityId}
              users={uniUsers}
              roleLabels={roleLabels}
              onAssign={handleAssignPresident}
              onRemove={handleRemovePresident}
            />
          ))}

          {users.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-8">
              لا يوجد مستخدمين حاليًا.
            </p>
          )}
        </section>

        <Sidebar />
      </div>
    </main>
  );
}

type UniversityUsersTableProps = {
  universityId: string;
  users: {
    id: string;
    name?: string;
    email?: string;
    role?: string;
    universityName?: string;
    clubId?: string;
    clubName?: string;
  }[];
  roleLabels: Record<string, string>;
  onAssign: (userId: string, clubId: string, clubName: string) => void;
  onRemove: (userId: string) => void;
};

function UniversityUsersTable({
  universityId,
  users,
  roleLabels,
  onAssign,
  onRemove,
}: UniversityUsersTableProps) {
  const { clubs } = useAdminClubs(
    universityId !== "unknown" ? universityId : undefined
  );

  const universityName = users[0]?.universityName || universityId;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-black text-[#21166A] mb-3 text-right">
        {universityName}
      </h2>

      <div className="bg-white rounded-[30px] p-5 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-[#EEE7F8]">
                <th className="pb-3 text-sm text-gray-400">المستخدم</th>
                <th className="pb-3 text-sm text-gray-400">البريد</th>
                <th className="pb-3 text-sm text-gray-400">الدور</th>
                <th className="pb-3 text-sm text-gray-400">النادي</th>
                <th className="pb-3 text-sm text-gray-400">إجراء</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-[#F3F0FA]"
                >
                  <td className="py-4 font-bold text-[#21166A]">
                    {user.name || "بدون اسم"}
                  </td>

                  <td className="py-4 text-sm text-gray-500">
                    {user.email || "لا يوجد بريد"}
                  </td>

                  <td className="py-4">
                    <span className="px-3 py-1 rounded-full bg-[#F3F0FA] text-[#21166A] text-xs font-bold">
                      {roleLabels[user.role || ""] || user.role || "student"}
                    </span>
                  </td>

                  <td className="py-4 text-sm text-gray-500">
                    {user.clubName || "—"}
                  </td>

                  <td className="py-4">
                    <div className="flex items-center gap-2 justify-end">
                      {clubs.length > 0 && (
                        <select
                          defaultValue=""
                          onChange={(e) => {
                            const club = clubs.find(
                              (c) => c.id === e.target.value
                            );
                            if (club) {
                              onAssign(user.id, club.id, club.name);
                            }
                          }}
                          className="rounded-xl border border-[#EEE7F8] bg-[#F8F6FC] px-3 py-2 text-xs outline-none"
                        >
                          <option value="" disabled>
                            تعيين كرئيس
                          </option>

                          {clubs.map((club) => (
                            <option key={club.id} value={club.id}>
                              {club.name}
                            </option>
                          ))}
                        </select>
                      )}

                      {user.role === "president" && (
                        <button
                          onClick={() => onRemove(user.id)}
                          className="px-3 py-2 rounded-xl bg-red-100 text-red-600 text-xs font-bold"
                        >
                          إزالة
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

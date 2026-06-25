"use client";

import Sidebar from "@/features/dashboard/components/Sidebar";

import useUsers from "../hooks/useUsers";

import {
  assignPresident,
  removePresidentRole,
} from "../services/users.service";

import { clubs } from "../data/clubs";

export default function AdminUsersPage() {
  const {
    users,
    loading,
    loadUsers,
  } = useUsers();

  async function handleAssignPresident(
    userId: string,
    clubId: string
  ) {
    const selectedClub = clubs.find(
      (club) => club.id === clubId
    );

    if (!selectedClub) {
      return;
    }

    await assignPresident(
      userId,
      selectedClub.id,
      selectedClub.name
    );

    loadUsers();
  }

  async function handleRemovePresident(
    userId: string
  ) {
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
      <div
        className="
          flex
          h-[calc(100vh-40px)]
          rounded-[36px]
          bg-white/60
          backdrop-blur-xl
          border border-white/80
          shadow-2xl
          overflow-hidden
        "
      >
        <section className="flex-1 h-full overflow-y-auto p-7">
          <div className="text-right mb-7">
            <h1 className="text-3xl font-black text-[#21166A]">
              إدارة المستخدمين
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              تعيين رؤساء الأندية وإدارة الصلاحيات من داخل المنصة
            </p>
          </div>

          <div className="bg-white rounded-[30px] p-5 shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b border-[#EEE7F8]">
                    <th className="pb-3 text-sm text-gray-400">
                      المستخدم
                    </th>
                    <th className="pb-3 text-sm text-gray-400">
                      البريد
                    </th>
                    <th className="pb-3 text-sm text-gray-400">
                      الدور
                    </th>
                    <th className="pb-3 text-sm text-gray-400">
                      النادي
                    </th>
                    <th className="pb-3 text-sm text-gray-400">
                      إجراء
                    </th>
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
                        <span
                          className="
                            px-3 py-1
                            rounded-full
                            bg-[#F3F0FA]
                            text-[#21166A]
                            text-xs
                            font-bold
                          "
                        >
                          {user.role || "member"}
                        </span>
                      </td>

                      <td className="py-4 text-sm text-gray-500">
                        {user.clubName || "لا يوجد"}
                      </td>

                      <td className="py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <select
                            defaultValue=""
                            onChange={(e) =>
                              handleAssignPresident(
                                user.id,
                                e.target.value
                              )
                            }
                            className="
                              rounded-xl
                              border border-[#EEE7F8]
                              bg-[#F8F6FC]
                              px-3 py-2
                              text-xs
                              outline-none
                            "
                          >
                            <option value="" disabled>
                              تعيين كرئيس
                            </option>

                            {clubs.map((club) => (
                              <option
                                key={club.id}
                                value={club.id}
                              >
                                {club.name}
                              </option>
                            ))}
                          </select>

                          {user.role === "president" && (
                            <button
                              onClick={() =>
                                handleRemovePresident(user.id)
                              }
                              className="
                                px-3 py-2
                                rounded-xl
                                bg-red-100
                                text-red-600
                                text-xs
                                font-bold
                              "
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

              {users.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">
                  لا يوجد مستخدمين حاليًا.
                </p>
              )}
            </div>
          </div>
        </section>

        <Sidebar />
      </div>
    </main>
  );
}
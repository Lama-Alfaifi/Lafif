"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { User, Building2, BookOpen, CheckCircle, ClipboardList } from "lucide-react";

import Sidebar from "@/features/dashboard/components/Sidebar";
import { useAuth } from "@/features/auth/context/AuthContext";
import { db } from "@/src/lib/firebase";
import MyRequestsSection from "@/features/joinRequests/components/MyRequestsSection";

const ROLE_LABEL: Record<string, string> = {
  student: "طالب",
  member: "عضو",
  vicePresident: "نائب الرئيس",
  president: "رئيس النادي",
  universityAdmin: "مسؤول الجامعة",
  superAdmin: "مسؤول النظام",
};

const ROLE_COLOR: Record<string, string> = {
  student: "bg-gray-100 text-gray-600",
  member: "bg-emerald-100 text-emerald-700",
  vicePresident: "bg-cyan-100 text-cyan-700",
  president: "bg-purple-100 text-purple-700",
  universityAdmin: "bg-indigo-100 text-indigo-700",
  superAdmin: "bg-red-100 text-red-600",
};

type Tab = "info" | "requests";

const TABS: { value: Tab; label: string; icon: React.ElementType }[] = [
  { value: "info", label: "معلوماتي", icon: User },
  { value: "requests", label: "طلباتي", icon: ClipboardList },
];

export default function ProfilePage() {
  const { user, profile, loading } = useAuth();

  const [tab, setTab] = useState<Tab>("info");
  const [name, setName] = useState(profile?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    if (!user || !name.trim()) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), { name: name.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#EFE8F7] p-5">
        <div className="flex h-[calc(100vh-40px)] rounded-[36px] bg-white/60 border border-white/80 shadow-2xl overflow-hidden items-center justify-center">
          <p className="text-sm font-bold text-[#21166A]">جاري التحميل...</p>
        </div>
      </main>
    );
  }

  const role = profile?.role ?? "student";
  const roleLabel = ROLE_LABEL[role] ?? role;
  const roleColor = ROLE_COLOR[role] ?? "bg-gray-100 text-gray-600";

  return (
    <main className="min-h-screen bg-[#EFE8F7] p-5 overflow-hidden">
      <div className="flex h-[calc(100vh-40px)] rounded-[36px] bg-white/60 backdrop-blur-xl border border-white/80 shadow-2xl overflow-hidden">
        <section className="flex-1 h-full overflow-y-auto p-7" dir="rtl">

          {/* Avatar card — always visible */}
          <div className="max-w-2xl mb-6">
            <div className="bg-white rounded-[28px] p-6 shadow-md flex items-center gap-5">
              <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-[#7C3AED] to-[#22C55E] flex items-center justify-center text-white text-2xl font-black shrink-0">
                {(profile?.name ?? "؟")[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-black text-[#21166A] truncate">
                  {profile?.name ?? "—"}
                </h2>
                <p className="text-sm text-gray-500 truncate mt-0.5">
                  {profile?.email ?? user?.email ?? "—"}
                </p>
                <span className={`mt-2 inline-block text-[11px] font-bold px-3 py-1 rounded-full ${roleColor}`}>
                  {roleLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {TABS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={`
                  flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition
                  ${tab === value
                    ? "bg-[#21166A] text-white shadow"
                    : "bg-white text-[#6B7280] hover:bg-[#F3F0FA] hover:text-[#21166A]"
                  }
                `}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* Tab: My Info */}
          {tab === "info" && (
            <div className="max-w-2xl space-y-5">

              <div className="bg-white rounded-[28px] p-6 shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <User size={18} className="text-purple-600" />
                  <h3 className="text-sm font-black text-[#21166A]">تعديل الاسم</h3>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="الاسم الكامل"
                    className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-[#21166A] outline-none focus:border-[#7C3AED] transition"
                  />
                  <button
                    onClick={handleSave}
                    disabled={saving || !name.trim()}
                    className="px-5 py-3 rounded-2xl bg-[#21166A] text-white text-sm font-bold hover:opacity-90 transition disabled:opacity-50"
                  >
                    {saved ? (
                      <span className="flex items-center gap-1.5">
                        <CheckCircle size={14} />
                        حُفظ
                      </span>
                    ) : saving ? "..." : "حفظ"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-[28px] p-5 shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 size={16} className="text-cyan-600" />
                    <span className="text-xs font-bold text-gray-400">الجامعة</span>
                  </div>
                  <p className="text-sm font-black text-[#21166A]">
                    {profile?.universityName ?? "—"}
                  </p>
                </div>

                <div className="bg-white rounded-[28px] p-5 shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen size={16} className="text-emerald-600" />
                    <span className="text-xs font-bold text-gray-400">النادي</span>
                  </div>
                  <p className="text-sm font-black text-[#21166A]">
                    {profile?.clubName ?? "لا يوجد نادي"}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-[28px] p-5 shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-gray-400">البريد الإلكتروني</span>
                </div>
                <p className="text-sm font-bold text-gray-600">
                  {profile?.email ?? user?.email ?? "—"}
                </p>
              </div>

            </div>
          )}

          {/* Tab: My Requests */}
          {tab === "requests" && (
            <div>
              <p className="text-sm text-gray-500 mb-5">
                جميع طلبات الانضمام التي أرسلتها إلى الأندية
              </p>
              <MyRequestsSection />
            </div>
          )}

        </section>

        <Sidebar />
      </div>
    </main>
  );
}

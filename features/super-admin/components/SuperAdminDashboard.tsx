"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Building2, Users, Trophy, Globe,
  BarChart2, ExternalLink, RefreshCw, Plus,
} from "lucide-react";
import Sidebar from "@/features/dashboard/components/Sidebar";
import AddUniversityModal from "./AddUniversityModal";
import Link from "next/link";

type University = {
  id: string;
  name: string;
  domain?: string;
  logoUrl?: string;
};

type GlobalStats = {
  universityCount: number;
  clubCount: number;
  userCount: number;
  submissionCount: number;
};

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-[24px] p-5 shadow-md border border-gray-50">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
      <p className="text-3xl font-black text-[#21166A]">{value}</p>
      <p className="text-xs text-gray-400 font-bold mt-1">{label}</p>
    </div>
  );
}

export default function SuperAdminDashboard() {
  const { profile, loading: authLoading } = useAuth();
  const router = useRouter();

  const [universities, setUniversities] = useState<University[]>([]);
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (profile?.role !== "superAdmin") {
      router.replace("/dashboard");
      return;
    }
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, profile?.role]);

  async function loadData() {
    setLoading(true);
    try {
      const [uniSnap, clubSnap, userSnap, subSnap] = await Promise.all([
        getDocs(collection(db, "universities")),
        getDocs(collection(db, "clubs")),
        getDocs(collection(db, "users")),
        getDocs(collection(db, "challengeSubmissions")),
      ]);

      setUniversities(
        uniSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<University, "id">) }))
      );

      setStats({
        universityCount: uniSnap.size,
        clubCount: clubSnap.size,
        userCount: userSnap.size,
        submissionCount: subSnap.size,
      });
    } catch (e) {
      console.error("[SuperAdmin]", e);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || (!stats && loading)) {
    return (
      <div className="flex min-h-screen bg-[#F7F5FF] items-center justify-center">
        <p className="font-bold text-[#21166A]">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F7F5FF]">
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
          <div className="px-8 py-4 flex items-center justify-between" dir="rtl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[14px] bg-purple-100 flex items-center justify-center">
                <Globe size={18} className="text-[#7C3AED]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#7C3AED] mb-0.5">لوحة المسؤول العام</p>
                <h1 className="text-xl font-black text-[#21166A]">نظرة عامة — جميع الجامعات</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#7C3AED] text-white text-xs font-bold hover:opacity-90 transition"
              >
                <Plus size={14} />
                إضافة جامعة
              </button>
              <button
                onClick={loadData}
                disabled={loading}
                className="w-9 h-9 rounded-2xl bg-[#EFE8F7] text-[#7C3AED] flex items-center justify-center hover:bg-[#E0D4F5] transition disabled:opacity-40"
              >
                <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-8" dir="rtl">

          {/* Global stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Globe}    label="الجامعات"      value={stats?.universityCount ?? 0} color="bg-[#21166A]" />
            <StatCard icon={Building2} label="الأندية"       value={stats?.clubCount ?? 0}       color="bg-[#7C3AED]" />
            <StatCard icon={Users}    label="المستخدمون"    value={stats?.userCount ?? 0}       color="bg-emerald-500" />
            <StatCard icon={Trophy}   label="تسليمات التحديات" value={stats?.submissionCount ?? 0} color="bg-amber-500" />
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-[24px] p-6 shadow-md border border-gray-50 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={15} className="text-[#7C3AED]" />
              <h2 className="text-sm font-black text-[#21166A]">إجراءات سريعة</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/users"
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#21166A] text-white text-xs font-bold hover:opacity-90 transition"
              >
                <Users size={14} />
                إدارة المستخدمين والأدوار
                <ExternalLink size={12} className="opacity-60" />
              </Link>
            </div>
          </div>

          {/* Universities list */}
          <div className="bg-white rounded-[24px] shadow-md border border-gray-50 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
              <Globe size={15} className="text-[#7C3AED]" />
              <h2 className="text-sm font-black text-[#21166A]">الجامعات المسجّلة</h2>
              <span className="mr-auto text-xs text-gray-400 font-bold">
                {universities.length} جامعة
              </span>
            </div>

            {loading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-2xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : universities.length === 0 ? (
              <div className="text-center py-10">
                <Globe size={28} className="text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400 font-bold">لا توجد جامعات مسجّلة</p>
                <p className="text-xs text-gray-300 mt-1">اضغط "إضافة جامعة" للبدء</p>
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {universities.map((uni, i) => (
                  <div
                    key={uni.id}
                    className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-gray-50 hover:bg-[#F7F5FF] transition"
                  >
                    <span className="w-8 h-8 rounded-xl bg-[#EFE8F7] text-[#7C3AED] text-xs font-black flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-[#21166A] truncate">{uni.name}</p>
                      {uni.domain && (
                        <p className="text-[11px] text-gray-400 font-bold mt-0.5">@{uni.domain}</p>
                      )}
                    </div>

                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full shrink-0">
                      {uni.id}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      <Sidebar />

      {showAddModal && (
        <AddUniversityModal
          onClose={() => setShowAddModal(false)}
          onCreated={() => { loadData(); setShowAddModal(false); }}
        />
      )}
    </div>
  );
}

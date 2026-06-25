"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  doc, getDoc, addDoc, collection,
  serverTimestamp, query, where, getDocs,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { useAuth } from "@/features/auth/context/AuthContext";
import {
  User, Mail, Trophy, Target, BookOpen,
  ArrowRight, CheckCircle, Clock,
} from "lucide-react";
import Sidebar from "@/features/dashboard/components/Sidebar";

type Club = {
  name: string;
  college: string;
  description: string;
  goals: string;
  achievements: string;
  president: string;
  email: string;
  image: string;
  universityId?: string;
};

type JoinStatus = "none" | "pending" | "member" | "loading";

export default function ClubPage() {
  const params = useParams();
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();

  const [club, setClub] = useState<Club | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [joinStatus, setJoinStatus] = useState<JoinStatus>("loading");
  const [requestLoading, setRequestLoading] = useState(false);
  const [message, setMessage] = useState("");

  const clubId = params.id as string;

  useEffect(() => {
    async function fetchClub() {
      try {
        const ref = doc(db, "clubs", clubId);
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) setClub(snapshot.data() as Club);
      } finally {
        setPageLoading(false);
      }
    }
    fetchClub();
  }, [clubId]);

  useEffect(() => {
    if (authLoading || !user) return;
    async function checkStatus() {
      if (!user) return;
      if (profile?.clubId === clubId) { setJoinStatus("member"); return; }
      const q = query(
        collection(db, "joinRequests"),
        where("userId", "==", user.uid),
        where("clubId", "==", clubId),
        where("status", "==", "pending")
      );
      const snap = await getDocs(q);
      setJoinStatus(snap.empty ? "none" : "pending");
    }
    checkStatus();
  }, [user?.uid, profile?.clubId, clubId, authLoading]);

  async function handleJoinRequest() {
    if (!user || !profile) { setMessage("يجب تسجيل الدخول أولاً"); return; }
    setRequestLoading(true);
    setMessage("");
    try {
      await addDoc(collection(db, "joinRequests"), {
        userId:        user.uid,
        userName:      profile.name ?? "",
        userEmail:     profile.email ?? user.email ?? "",
        clubId,
        clubName:      club?.name ?? "",
        universityId:  profile.universityId ?? club?.universityId ?? "",
        universityName: profile.universityName ?? "",
        status:        "pending",
        createdAt:     serverTimestamp(),
      });
      setJoinStatus("pending");
      setMessage("تم إرسال الطلب بنجاح! سيتم إشعارك عند قبوله.");
    } catch {
      setMessage("حدث خطأ أثناء الإرسال، حاول مرة أخرى.");
    } finally {
      setRequestLoading(false);
    }
  }

  if (pageLoading || authLoading) {
    return (
      <div className="flex min-h-screen bg-[#F7F5FF] items-center justify-center">
        <p className="font-bold text-[#21166A]">جاري التحميل...</p>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="flex min-h-screen bg-[#F7F5FF] items-center justify-center">
        <p className="font-bold text-[#21166A]">النادي غير موجود</p>
      </div>
    );
  }

  function JoinButton() {
    if (joinStatus === "loading") return null;

    if (joinStatus === "member") {
      return (
        <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-100 text-emerald-700 text-sm font-bold">
          <CheckCircle size={16} />
          أنت عضو في هذا النادي
        </div>
      );
    }

    if (joinStatus === "pending") {
      return (
        <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-100 text-amber-700 text-sm font-bold">
          <Clock size={16} />
          طلبك قيد المراجعة
        </div>
      );
    }

    return (
      <button
        onClick={handleJoinRequest}
        disabled={requestLoading}
        className="px-5 py-2.5 rounded-2xl bg-[#21166A] text-white text-sm font-bold hover:opacity-90 transition disabled:opacity-60 shadow"
      >
        {requestLoading ? "جارٍ الإرسال..." : "طلب الانضمام"}
      </button>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F7F5FF]">
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Sticky page header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
          <div className="px-8 py-4 flex items-center justify-between" dir="rtl">
            <div>
              <p className="text-xs font-bold text-[#7C3AED] mb-0.5">الأندية</p>
              <h1 className="text-xl font-black text-[#21166A]">{club.name}</h1>
            </div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#F7F5FF] border border-gray-100 text-sm font-bold text-gray-500 hover:bg-[#EFE8F7] hover:text-[#21166A] transition"
            >
              <ArrowRight size={16} />
              رجوع
            </button>
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-8">

          {/* Hero card */}
          <div className="relative overflow-hidden bg-white rounded-[28px] border border-gray-50 shadow-md p-6 mb-6">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-purple-200/30 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-emerald-200/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between" dir="rtl">
              <div className="flex items-center gap-5">
                <img
                  src={club.image}
                  alt={club.name}
                  className="w-20 h-20 rounded-[20px] object-cover shadow-md"
                />
                <div>
                  <h2 className="text-2xl font-black text-[#21166A]">{club.name}</h2>
                  <p className="text-sm text-gray-500 mt-1 font-medium">{club.college}</p>
                  <div className="flex gap-2 mt-3">
                    <span className="px-3 py-1.5 rounded-full bg-[#EFE8F7] text-[#21166A] text-xs font-bold">
                      نادي جامعي
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                      نشط
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <JoinButton />
              </div>
            </div>

            {message && (
              <p className="mt-4 text-sm text-gray-600 font-medium text-right" dir="rtl">
                {message}
              </p>
            )}
          </div>

          {/* Info strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" dir="rtl">
            <div className="bg-white rounded-[24px] p-5 shadow-md border border-gray-50 flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0">
                <User size={18} className="text-[#7C3AED]" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold">رئيس النادي</p>
                <p className="text-sm font-black text-[#21166A] mt-0.5">{club.president}</p>
              </div>
            </div>

            <div className="bg-white rounded-[24px] p-5 shadow-md border border-gray-50 flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 flex items-center justify-center shrink-0">
                <Mail size={18} className="text-cyan-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold">البريد الإلكتروني</p>
                <p className="text-sm font-black text-[#21166A] mt-0.5">{club.email}</p>
              </div>
            </div>

            <div className="bg-white rounded-[24px] p-5 shadow-md border border-gray-50 flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                <BookOpen size={18} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold">الكلية</p>
                <p className="text-sm font-black text-[#21166A] mt-0.5">{club.college}</p>
              </div>
            </div>
          </div>

          {/* Detail sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" dir="rtl">
            <section className="bg-white rounded-[24px] p-6 shadow-md border border-gray-50">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
                  <BookOpen size={15} className="text-[#7C3AED]" />
                </div>
                <h2 className="text-base font-black text-[#21166A]">نبذة عن النادي</h2>
              </div>
              <p className="text-sm leading-8 text-gray-600">{club.description}</p>
            </section>

            <section className="bg-white rounded-[24px] p-6 shadow-md border border-gray-50">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-cyan-50 flex items-center justify-center">
                  <Target size={15} className="text-cyan-600" />
                </div>
                <h2 className="text-base font-black text-[#21166A]">أهداف النادي</h2>
              </div>
              <ul className="space-y-3">
                {club.goals?.split("\n").map((goal, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-600 leading-7">
                    <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#7C3AED] shrink-0" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-white rounded-[24px] p-6 shadow-md border border-gray-50 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Trophy size={15} className="text-amber-500" />
                </div>
                <h2 className="text-base font-black text-[#21166A]">أعمال وإنجازات النادي</h2>
              </div>
              <p className="text-sm leading-8 text-gray-600">{club.achievements}</p>
            </section>
          </div>
        </div>
      </div>

      <Sidebar />
    </div>
  );
}

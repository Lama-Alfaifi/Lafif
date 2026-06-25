"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { useAuth } from "@/features/auth/context/AuthContext";
import {
  User,
  Mail,
  Trophy,
  Target,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Clock,
} from "lucide-react";

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

      if (profile?.clubId === clubId) {
        setJoinStatus("member");
        return;
      }

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
    if (!user || !profile) {
      setMessage("يجب تسجيل الدخول أولاً");
      return;
    }

    setRequestLoading(true);
    setMessage("");

    try {
      await addDoc(collection(db, "joinRequests"), {
        userId: user.uid,
        userName: profile.name ?? "",
        userEmail: profile.email ?? user.email ?? "",
        clubId,
        clubName: club?.name ?? "",
        universityId: profile.universityId ?? club?.universityId ?? "",
        universityName: profile.universityName ?? "",
        status: "pending",
        createdAt: serverTimestamp(),
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
      <div className="min-h-screen flex items-center justify-center text-xl font-bold">
        جاري التحميل...
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        النادي غير موجود
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
        className="px-5 py-2.5 rounded-2xl bg-[#21166A] text-white text-sm font-bold hover:opacity-90 transition disabled:opacity-60"
      >
        {requestLoading ? "جارٍ الإرسال..." : "طلب الانضمام"}
      </button>
    );
  }

  return (
    <main className="min-h-screen bg-[#EFE8F7] p-6">
      <div className="max-w-7xl mx-auto">
        <section className="relative overflow-hidden rounded-[32px] bg-white border border-white shadow-xl p-6">
          <div className="absolute top-0 left-0 w-60 h-60 bg-purple-200/30 blur-3xl rounded-full" />

          <div className="relative z-10 flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="flex items-center gap-5">
              <img
                src={club.image}
                alt={club.name}
                className="w-28 h-28 rounded-3xl object-cover shadow-lg"
              />
              <div>
                <h1 className="text-3xl font-black text-[#21166A]">{club.name}</h1>
                <p className="mt-2 text-sm text-gray-500 font-medium">{club.college}</p>
                <div className="flex gap-3 mt-4">
                  <div className="px-4 py-2 rounded-2xl bg-[#F3F0FA] text-[#21166A] text-sm font-bold">
                    نادي جامعي
                  </div>
                  <div className="px-4 py-2 rounded-2xl bg-emerald-100 text-emerald-700 text-sm font-bold">
                    نشط
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <JoinButton />
              <button
                onClick={() => router.back()}
                className="w-10 h-10 rounded-2xl bg-[#F3F0FA] text-[#21166A] flex items-center justify-center hover:bg-[#E9E1F8] transition"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {message && (
            <p className="mt-4 text-sm text-gray-600 font-medium">{message}</p>
          )}
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
          <div className="bg-white rounded-[28px] p-5 shadow-md">
            <div className="flex items-center gap-3">
              <User className="text-purple-600" size={20} />
              <div>
                <p className="text-xs text-gray-400">رئيس النادي</p>
                <h3 className="text-sm font-bold text-[#21166A] mt-1">{club.president}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[28px] p-5 shadow-md">
            <div className="flex items-center gap-3">
              <Mail className="text-cyan-600" size={20} />
              <div>
                <p className="text-xs text-gray-400">البريد الإلكتروني</p>
                <h3 className="text-sm font-bold text-[#21166A] mt-1">{club.email}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[28px] p-5 shadow-md">
            <div className="flex items-center gap-3">
              <BookOpen className="text-emerald-600" size={20} />
              <div>
                <p className="text-xs text-gray-400">الكلية</p>
                <h3 className="text-sm font-bold text-[#21166A] mt-1">{club.college}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <section className="bg-white rounded-[30px] p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="text-purple-600" size={20} />
              <h2 className="text-lg font-black text-[#21166A]">نبذة عن النادي</h2>
            </div>
            <p className="text-sm leading-8 text-gray-600">{club.description}</p>
          </section>

          <section className="bg-white rounded-[30px] p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Target className="text-cyan-600" size={20} />
              <h2 className="text-lg font-black text-[#21166A]">أهداف النادي</h2>
            </div>
            <ul className="space-y-3">
              {club.goals?.split("\n").map((goal, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-gray-600 leading-7">
                  <span className="mt-2 w-2 h-2 rounded-full bg-[#7C3AED] shrink-0" />
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-[30px] p-6 shadow-md lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="text-yellow-500" size={20} />
              <h2 className="text-lg font-black text-[#21166A]">أعمال وإنجازات النادي</h2>
            </div>
            <p className="text-sm leading-8 text-gray-600">{club.achievements}</p>
          </section>
        </div>
      </div>
    </main>
  );
}
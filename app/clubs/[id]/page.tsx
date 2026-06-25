"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "@/src/lib/firebase";

import {
  User,
  Mail,
  Trophy,
  Target,
  BookOpen,
  ArrowRight,
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

export default function ClubPage() {
  const params = useParams();
  const router = useRouter();

  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchClub() {
      try {
        const ref = doc(db, "clubs", params.id as string);
        const snapshot = await getDoc(ref);

        if (snapshot.exists()) {
          setClub(snapshot.data() as Club);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchClub();
  }, [params]);

  async function handleJoinRequest() {
    setRequestLoading(true);
    setMessage("");

    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setMessage("يجب تسجيل الدخول أولاً");
        return;
      }

      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setMessage("لم يتم العثور على بيانات المستخدم");
        return;
      }

      const userData = userSnap.data();

      await addDoc(collection(db, "joinRequests"), {
        userId: currentUser.uid,
        userName: userData.name || "",
        userEmail: userData.email || currentUser.email || "",

        clubId: params.id,
        clubName: club?.name || "",

        universityId: userData.universityId || club?.universityId || "",
        universityName: userData.universityName || "",

        status: "pending",
        createdAt: serverTimestamp(),
      });

      setMessage("تم إرسال الطلب بنجاح");
    } catch (error) {
      setMessage("حدث خطأ أثناء الإرسال");
    } finally {
      setRequestLoading(false);
    }
  }

  if (loading) {
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
                <h1 className="text-3xl font-black text-[#21166A]">
                  {club.name}
                </h1>

                <p className="mt-2 text-sm text-gray-500 font-medium">
                  {club.college}
                </p>

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
              <button
                onClick={handleJoinRequest}
                disabled={requestLoading}
                className="px-5 py-2.5 rounded-2xl bg-[#21166A] text-white text-sm font-bold hover:opacity-90 transition"
              >
                {requestLoading ? "جارٍ الإرسال..." : "طلب الانضمام"}
              </button>

              <button
                onClick={() => router.back()}
                className="w-10 h-10 rounded-2xl bg-[#F3F0FA] text-[#21166A] flex items-center justify-center hover:bg-[#E9E1F8] transition"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {message && (
            <p className="mt-4 text-sm text-gray-600">
              {message}
            </p>
          )}
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
          <div className="bg-white rounded-[28px] p-5 shadow-md">
            <div className="flex items-center gap-3">
              <User className="text-purple-600" size={20} />
              <div>
                <p className="text-xs text-gray-400">رئيس النادي</p>
                <h3 className="text-sm font-bold text-[#21166A] mt-1">
                  {club.president}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[28px] p-5 shadow-md">
            <div className="flex items-center gap-3">
              <Mail className="text-cyan-600" size={20} />
              <div>
                <p className="text-xs text-gray-400">البريد الإلكتروني</p>
                <h3 className="text-sm font-bold text-[#21166A] mt-1">
                  {club.email}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[28px] p-5 shadow-md">
            <div className="flex items-center gap-3">
              <BookOpen className="text-emerald-600" size={20} />
              <div>
                <p className="text-xs text-gray-400">الكلية</p>
                <h3 className="text-sm font-bold text-[#21166A] mt-1">
                  {club.college}
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <section className="bg-white rounded-[30px] p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="text-purple-600" size={20} />
              <h2 className="text-lg font-black text-[#21166A]">
                نبذة عن النادي
              </h2>
            </div>

            <p className="text-sm leading-8 text-gray-600">
              {club.description}
            </p>
          </section>

          <section className="bg-white rounded-[30px] p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Target className="text-cyan-600" size={20} />
              <h2 className="text-lg font-black text-[#21166A]">
                أهداف النادي
              </h2>
            </div>

            <ul className="space-y-3">
              {club.goals?.split("\n").map((goal, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm text-gray-600 leading-7"
                >
                  <span className="mt-2 w-2 h-2 rounded-full bg-[#7C3AED] shrink-0" />
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-[30px] p-6 shadow-md lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="text-yellow-500" size={20} />
              <h2 className="text-lg font-black text-[#21166A]">
                أعمال وإنجازات النادي
              </h2>
            </div>

            <p className="text-sm leading-8 text-gray-600">
              {club.achievements}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
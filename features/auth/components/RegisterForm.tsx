"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "@/src/lib/firebase";

import AuthLayout from "./AuthLayout";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setErr("");
    setSuccess("");
    setLoading(true);

    try {
      const emailDomain = email.trim().split("@")[1];

      if (!emailDomain) {
        setErr("البريد الجامعي غير صالح");
        return;
      }

      const universitiesQuery = query(
        collection(db, "universities"),
        where("domain", "==", emailDomain)
      );

      const universitySnapshot = await getDocs(
        universitiesQuery
      );

      if (universitySnapshot.empty) {
        setErr("هذه الجامعة غير مدعومة حالياً");
        return;
      }

      const universityDoc = universitySnapshot.docs[0];
      const universityData = universityDoc.data();

      // Read universityId from an explicit field first, fall back to doc ID
      const resolvedUniversityId: string =
        (universityData.universityId as string) ||
        universityDoc.id;

      // Accept both "name" and "universityName" field spellings
      const resolvedUniversityName: string =
        (universityData.name as string) ||
        (universityData.universityName as string) ||
        "";

      if (!resolvedUniversityId) {
        setErr("بيانات الجامعة غير مكتملة، تواصل مع الإدارة.");
        return;
      }

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      await sendEmailVerification(
        userCredential.user
      );

      await setDoc(
        doc(db, "users", userCredential.user.uid),
        {
          name: fullName,
          email: email.trim(),
          role: "student",
          universityId: resolvedUniversityId,
          universityName: resolvedUniversityName,
          emailVerified: false,
          createdAt: new Date(),
        }
      );

      setSuccess(
        "تم إنشاء الحساب. تم إرسال رسالة تحقق إلى بريدك الجامعي، يرجى التحقق ثم تسجيل الدخول."
      );

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      const msg =
        error?.code === "auth/email-already-in-use"
          ? "هذا البريد مستخدم مسبقاً"
          : error?.code === "auth/weak-password"
          ? "كلمة المرور ضعيفة، يجب أن تكون 6 أحرف على الأقل"
          : "تعذر إنشاء الحساب، يرجى التحقق من البيانات";

      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="إنشاء حساب"
      subtitle="أنشئ حسابك للانضمام إلى منصة لفيف"
    >
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="الاسم الكامل"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full h-12 rounded-xl border border-[#D9DCE3] bg-white px-4 text-sm text-[#111827] placeholder:text-[#6B7280] outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition text-right"
            dir="rtl"
          />
        </div>

        <div>
          <input
            type="email"
            dir="ltr"
            placeholder="example@stu.jazanu.edu.sa"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-12 rounded-xl border border-[#D9DCE3] bg-white px-4 text-sm text-[#111827] placeholder:text-[#6B7280] outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition"
          />
        </div>

        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full h-12 rounded-xl border border-[#D9DCE3] bg-white px-4 text-sm text-[#111827] placeholder:text-[#6B7280] outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition"
          />

          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-[#4B5563] font-medium"
          >
            {showPw ? "إخفاء" : "إظهار"}
          </button>
        </div>

        {err && (
          <p className="text-xs text-red-600 font-medium text-right" dir="rtl">
            {err}
          </p>
        )}

        {success && (
          <p className="text-xs text-emerald-600 font-bold text-right leading-6" dir="rtl">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-[#22C55E] text-white text-base font-bold hover:opacity-90 transition disabled:opacity-60 shadow-sm mt-2"
        >
          {loading ? "جارٍ إنشاء الحساب..." : "إنشاء الحساب"}
        </button>

        <div
          className="text-center text-sm text-[#4B5563] font-medium mt-4"
          dir="rtl"
        >
          لديك حساب بالفعل؟{" "}
          <Link
            href="/login"
            className="text-[#2D248B] font-bold hover:underline"
          >
            تسجيل الدخول
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
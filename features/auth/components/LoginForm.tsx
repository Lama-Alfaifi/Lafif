"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "@/src/lib/firebase";

import AuthLayout from "./AuthLayout";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setErr("");
    setLoading(true);

    try {
      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      const userRef = doc(
        db,
        "users",
        userCredential.user.uid
      );

      const userSnap = await getDoc(userRef);

      const userData = userSnap.exists()
        ? userSnap.data()
        : null;

      if (
        userCredential.user.emailVerified &&
        userSnap.exists()
      ) {
        await updateDoc(userRef, {
          emailVerified: true,
        });
      }

      if (userData?.role === "superAdmin") {
        router.push("/admin/users");
      } else if (userData?.role === "universityAdmin") {
        router.push("/university-admin");
      } else if (userData?.role === "president") {
        router.push("/president");
      } else if (userData?.role === "vicePresident") {
        router.push("/president");
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      const msg =
        error?.code === "auth/invalid-credential"
          ? "بيانات الدخول غير صحيحة"
          : "تعذر تسجيل الدخول";

      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="تسجيل الدخول"
      subtitle="سجّل دخولك للوصول إلى منصة لفيف"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            dir="ltr"
            placeholder="example@stu.jazanu.edu.sa"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
            className="w-full h-12 rounded-xl border border-[#D9DCE3] bg-white px-4 text-sm text-[#111827] placeholder:text-[#6B7280] outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition"
          />
        </div>

        <div className="relative">
          <input
            type={
              showPw
                ? "text"
                : "password"
            }
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
            className="w-full h-12 rounded-xl border border-[#D9DCE3] bg-white px-4 text-sm text-[#111827] placeholder:text-[#6B7280] outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition"
          />

          <button
            type="button"
            onClick={() =>
              setShowPw((v) => !v)
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-[#4B5563] font-medium"
          >
            {showPw ? "إخفاء" : "إظهار"}
          </button>
        </div>

        {err ? (
          <p className="text-xs text-red-600 font-medium leading-6">
            {err}
          </p>
        ) : null}

        <div
          className="flex items-center justify-between text-xs py-1"
          dir="rtl"
        >
          <label className="flex items-center gap-2 text-[#4B5563] font-medium cursor-pointer">
            <input
              type="checkbox"
              className="rounded text-purple-600"
            />
            تذكرني
          </label>

          <Link
            href="/reset"
            className="text-[#2D248B] font-bold hover:underline"
          >
            نسيت كلمة المرور؟
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-[#22C55E] text-white text-base font-bold hover:opacity-90 transition disabled:opacity-60 shadow-sm"
        >
          {loading
            ? "جارٍ الدخول..."
            : "تسجيل الدخول"}
        </button>

        <div
          className="text-center text-xs text-[#4B5563] font-medium pt-2"
          dir="rtl"
        >
          ليس لديك حساب؟{" "}
          <Link
            href="/register"
            className="text-[#2D248B] font-bold hover:underline"
          >
            إنشاء حساب
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
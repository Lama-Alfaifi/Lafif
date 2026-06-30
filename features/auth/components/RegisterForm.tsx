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
import { useLanguage } from "@/features/i18n/context/LanguageContext";

export default function RegisterForm() {
  const router = useRouter();
  const { t } = useLanguage();

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
        setErr(t.auth.errBadEmail);
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
        setErr(t.auth.errUniNotSup);
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
        setErr(t.auth.errUniData);
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

      setSuccess(t.auth.successReg);

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      const msg =
        error?.code === "auth/email-already-in-use"
          ? t.auth.errInUse
          : error?.code === "auth/weak-password"
          ? t.auth.errWeakPw
          : t.auth.errRegister;

      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title={t.auth.registerTitle} subtitle={t.auth.registerSub}>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder={t.auth.namePh}
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
            placeholder={t.auth.passwordPh}
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
            {showPw ? t.auth.hide : t.auth.show}
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
          {loading ? t.auth.registering : t.auth.registerBtn}
        </button>

        <div
          className="text-center text-sm text-[#4B5563] font-medium mt-4"
          dir="rtl"
        >
          {t.auth.hasAccount}{" "}
          <Link href="/login" className="text-[#2D248B] font-bold hover:underline">
            {t.auth.loginLink}
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
// app/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  createUserWithEmailAndPassword,
} from "firebase/auth";

import {
  doc,
  setDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "@/src/lib/firebase";

import AuthLayout from "@/features/auth/components/AuthLayout";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      const user = userCredential.user;

      await setDoc(
        doc(db, "users", user.uid),
        {
          name,
          email: email.trim(),
          role: "member",
          joinedClubs: [],
          createdAt: new Date(),
        }
      );

      router.push("/dashboard");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("البريد مستخدم مسبقًا.");
      } else {
        setError("حدث خطأ أثناء إنشاء الحساب.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create an account."
      subtitle="Explore clubs first, then join the one you like"
    >
      <form
        onSubmit={handleRegister}
        className="flex flex-col gap-5"
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          required
          className="
            w-full
            rounded-2xl
            border
            border-gray-200
            bg-[#FAFAFA]
            px-5
            py-3.5
            text-sm text-[#111827]
            placeholder:text-[#6B7280]
            outline-none
            transition
            focus:border-purple-400
            focus:bg-white
          "
        />

        <input
          type="email"
          dir="ltr"
          placeholder="Email address"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
          className="
            w-full
            rounded-2xl
            border
            border-gray-200
            bg-[#FAFAFA]
            px-5
            py-3.5
            text-sm text-[#111827]
            placeholder:text-[#6B7280]
            outline-none
            transition
            focus:border-purple-400
            focus:bg-white
          "
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
          minLength={6}
          className="
            w-full
            rounded-2xl
            border
            border-gray-200
            bg-[#FAFAFA]
            px-5
            py-3.5
            text-sm text-[#111827]
            placeholder:text-[#6B7280]
            outline-none
            transition
            focus:border-purple-400
            focus:bg-white
          "
        />

        {error && (
          <p className="text-sm text-rose-500">
            {error}
          </p>
        )}

        <p className="text-xs text-gray-500 leading-6 text-center">
          By signing up you agree to our
          <span className="text-purple-700">
            {" "}Terms
          </span>
          {" "}and{" "}
          <span className="text-purple-700">
            Privacy Policy
          </span>
        </p>

        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            rounded-2xl
            bg-[#22C55E]
            text-white
            py-3.5
            font-bold
            transition
            hover:scale-[1.01]
            active:scale-[0.99]
            disabled:opacity-60
          "
        >
          {loading
            ? "Creating account..."
            : "Sign Up"}
        </button>

        <div className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="
              text-purple-700
              font-semibold
              hover:underline
            "
          >
            Sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
"use client";

import { useState } from "react";
import { X, Building2, Globe, User, Mail, Lock, CheckCircle } from "lucide-react";
import { createUniversityWithAdmin, type NewUniversityArgs } from "../services/onboarding.service";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

const EMPTY: NewUniversityArgs = {
  universityName: "",
  domain: "",
  adminName: "",
  adminEmail: "",
  adminPassword: "",
};

function Field({
  icon: Icon,
  placeholder,
  value,
  onChange,
  type = "text",
  dir,
}: {
  icon: React.ElementType;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="relative">
      <Icon size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir={dir}
        className="w-full pr-10 pl-4 py-3 rounded-2xl bg-white border border-gray-100 text-sm font-bold text-[#21166A] placeholder:text-gray-300 outline-none focus:border-[#7C3AED] transition"
      />
    </div>
  );
}

export default function AddUniversityModal({ onClose, onCreated }: Props) {
  const [form, setForm] = useState<NewUniversityArgs>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<{ universityId: string } | null>(null);

  function set(key: keyof NewUniversityArgs, raw: string) {
    const value =
      key === "domain" || key === "adminEmail"
        ? raw.toLowerCase().replace(/\s/g, "")
        : raw;
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): string {
    if (!form.universityName.trim()) return "أدخل اسم الجامعة";
    if (!form.domain.trim()) return "أدخل نطاق البريد (مثال: kau.edu.sa)";
    if (!form.adminName.trim()) return "أدخل اسم المسؤول";
    if (!form.adminEmail.trim()) return "أدخل بريد المسؤول";
    if (!form.adminEmail.endsWith(`@${form.domain}`))
      return `بريد المسؤول يجب أن ينتهي بـ @${form.domain}`;
    if (form.adminPassword.length < 6) return "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    return "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError("");
    try {
      const { universityId } = await createUniversityWithAdmin(form);
      setCreated({ universityId });
      onCreated(); // refresh parent list
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : String(err);
      if (raw.includes("email-already-in-use"))
        setError("هذا البريد الإلكتروني مستخدم بالفعل");
      else if (raw.includes("weak-password"))
        setError("كلمة المرور ضعيفة جداً — استخدم 6 أحرف أو أكثر");
      else if (raw.includes("invalid-email"))
        setError("صيغة البريد الإلكتروني غير صحيحة");
      else
        setError(raw);
    } finally {
      setLoading(false);
    }
  }

  /* ── Success state ─────────────────────────────────────────────── */
  if (created) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
        <div className="bg-white rounded-[28px] p-8 w-full max-w-md shadow-2xl text-center" dir="rtl">
          <div className="w-16 h-16 rounded-[20px] bg-emerald-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={30} className="text-emerald-500" />
          </div>
          <h2 className="text-xl font-black text-[#21166A] mb-2">تم إنشاء الجامعة بنجاح</h2>
          <p className="text-sm text-gray-500 mb-1">
            <span className="font-black text-[#21166A]">{form.universityName}</span> أصبحت جاهزة
          </p>
          <div className="bg-[#F7F5FF] rounded-[16px] p-4 mt-4 mb-6 text-right space-y-1.5">
            <p className="text-xs text-gray-400 font-bold">بيانات دخول المسؤول</p>
            <p className="text-sm font-black text-[#21166A]">{form.adminName}</p>
            <p className="text-xs font-bold text-gray-500" dir="ltr">{form.adminEmail}</p>
            <p className="text-[10px] text-gray-400">كلمة المرور المُعيَّنة محفوظة لديك</p>
          </div>
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-[#21166A] text-white font-black text-sm hover:opacity-90 transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    );
  }

  /* ── Form state ────────────────────────────────────────────────── */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[28px] p-8 w-full max-w-lg shadow-2xl" dir="rtl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold text-[#7C3AED] mb-0.5">SuperAdmin</p>
            <h2 className="text-xl font-black text-[#21166A]">إضافة جامعة جديدة</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition text-gray-500"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* University info */}
          <div className="bg-[#F7F5FF] rounded-[20px] p-4 space-y-3">
            <p className="text-xs font-black text-[#7C3AED]">معلومات الجامعة</p>
            <Field
              icon={Building2}
              placeholder="اسم الجامعة (مثال: جامعة الملك عبدالعزيز)"
              value={form.universityName}
              onChange={(v) => set("universityName", v)}
            />
            <Field
              icon={Globe}
              placeholder="نطاق البريد (مثال: kau.edu.sa)"
              value={form.domain}
              onChange={(v) => set("domain", v)}
              dir="ltr"
            />
            {form.domain && (
              <p className="text-[11px] text-[#7C3AED] font-bold px-1">
                سيُقبل تسجيل الطلاب من: @{form.domain}
              </p>
            )}
          </div>

          {/* Admin info */}
          <div className="bg-gray-50 rounded-[20px] p-4 space-y-3">
            <p className="text-xs font-black text-gray-500">أول مسؤول للجامعة (University Admin)</p>
            <Field
              icon={User}
              placeholder="الاسم الكامل"
              value={form.adminName}
              onChange={(v) => set("adminName", v)}
            />
            <Field
              icon={Mail}
              placeholder={`البريد الإلكتروني (admin@${form.domain || "kau.edu.sa"})`}
              value={form.adminEmail}
              onChange={(v) => set("adminEmail", v)}
              type="email"
              dir="ltr"
            />
            <Field
              icon={Lock}
              placeholder="كلمة المرور (6 أحرف على الأقل)"
              value={form.adminPassword}
              onChange={(v) => set("adminPassword", v)}
              type="password"
              dir="ltr"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs font-bold text-red-500 bg-red-50 rounded-2xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-[#21166A] text-white font-black text-sm hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "جاري الإنشاء..." : "إنشاء الجامعة والمسؤول"}
          </button>
        </form>
      </div>
    </div>
  );
}

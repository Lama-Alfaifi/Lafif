"use client";

import { Zap } from "lucide-react";
import { useLanguage } from "@/features/i18n/context/LanguageContext";

type AuthLayoutProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  const { t, dir } = useLanguage();
  return (
    <main className="min-h-screen bg-[#F7F5FF] flex items-center justify-center p-6" dir={dir}>
      <div className="fixed -top-24 -right-24 w-[480px] h-[480px] rounded-full bg-purple-300/20 blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 -left-20 w-[380px] h-[380px] rounded-full bg-emerald-200/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl font-black text-[#21166A]">{t.auth.logo}</span>
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-purple-100 shadow-sm text-xs font-bold text-[#7C3AED]">
            <Zap size={12} />
            {t.auth.tagline}
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[32px] shadow-xl shadow-purple-900/10 border border-gray-50 px-7 py-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-black text-[#21166A]">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-400 mt-1.5 font-medium">{subtitle}</p>
            )}
          </div>

          {children}
        </div>
      </div>
    </main>
  );
}

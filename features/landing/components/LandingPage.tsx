"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users, CalendarDays, Sparkles, BarChart3,
  ChevronLeft, ChevronRight, GraduationCap, ShieldCheck, Zap, Globe,
} from "lucide-react";

/* ─── i18n content ──────────────────────────────────────────────── */
const CONTENT = {
  ar: {
    dir: "rtl" as const,
    lang: "ar",
    logo: "لفيف",
    nav: { login: "تسجيل الدخول", register: "إنشاء حساب" },
    heroBadge: "منصة إدارة الأندية الجامعية",
    heroTitle1: "كل نادٍ جامعي",
    heroTitle2: "له عالمه الخاص",
    heroSub:
      "لفيف منصة متكاملة تجمع الأندية الجامعية في مكان واحد — إدارة الأعضاء، تنظيم الفعاليات، وتحديات ذكية أسبوعية مدعومة بالذكاء الاصطناعي.",
    ctaPrimary: "ابدأ مجانًا",
    ctaSecondary: "تسجيل الدخول",
    stats: [
      { value: "١٠٠٪", label: "عزل بيانات بين الجامعات" },
      { value: "٥ أدوار", label: "رئيس، نائب، عضو، طالب" },
      { value: "AI", label: "تحديات ذكية أسبوعية" },
    ],
    featuresLabel: "الميزات",
    featuresTitle: "كل ما تحتاجه في مكان واحد",
    features: [
      {
        title: "إدارة الأندية",
        desc: "أنشئ أندية جامعية، أضف أعضاء، وتابع نشاط كل نادٍ بلوحة تحكم مخصصة لرئيس النادي.",
        gradient: "from-violet-500 to-purple-700",
      },
      {
        title: "الفعاليات والورش",
        desc: "خطط للفعاليات، سجّل الحضور، وابعث تقييمات آنية لكل ورشة أو نشاط.",
        gradient: "from-cyan-500 to-teal-600",
      },
      {
        title: "التحديات الأسبوعية بالذكاء الاصطناعي",
        desc: "يولّد النظام تحديات MCQ أسبوعية لكل نادٍ، ويُظهر لوحة متصدرين للأعضاء الأكثر نشاطًا.",
        gradient: "from-amber-400 to-orange-500",
      },
      {
        title: "تحليلات متقدمة",
        desc: "تتبّع معدلات الانضمام، الحضور، والتقييم — كل شيء مُصنَّف حسب الجامعة والنادي.",
        gradient: "from-emerald-500 to-green-700",
      },
    ],
    icons: [Users, CalendarDays, Sparkles, BarChart3],
    stepsLabel: "كيف تبدأ؟",
    stepsTitle: "ثلاث خطوات فقط",
    steps: [
      { n: "١", title: "سجّل حسابك", desc: "أنشئ حسابًا بإيميلك الجامعي وستُربط تلقائيًا بجامعتك." },
      { n: "٢", title: "انضم لنادٍ", desc: "تصفّح أندية جامعتك وأرسل طلب انضمام. الرئيس يقبلك بضغطة زر." },
      { n: "٣", title: "شارك واحتفِ", desc: "سجّل حضور الفعاليات، قيّمها، وتنافس في التحديات الأسبوعية." },
    ],
    ctaTitle: "هل أنت مسؤول جامعة أو رئيس نادٍ؟",
    ctaDesc: "تواصل معنا لإضافة جامعتك إلى المنصة وتفعيل جميع الميزات لأنديتك.",
    ctaBtn: "إنشاء حساب الآن",
    footerRights: `© ${new Date().getFullYear()} لفيف. جميع الحقوق محفوظة.`,
    langToggle: "English",
  },
  en: {
    dir: "ltr" as const,
    lang: "en",
    logo: "Lafif",
    nav: { login: "Sign In", register: "Get Started" },
    heroBadge: "University Club Management Platform",
    heroTitle1: "Every university club",
    heroTitle2: "deserves its own world",
    heroSub:
      "Lafif is an all-in-one platform that unites university clubs — member management, event organisation, and AI-powered weekly challenges.",
    ctaPrimary: "Start for free",
    ctaSecondary: "Sign in",
    stats: [
      { value: "100%", label: "Data isolation per university" },
      { value: "5 roles", label: "President, VP, member, student" },
      { value: "AI", label: "Smart weekly challenges" },
    ],
    featuresLabel: "Features",
    featuresTitle: "Everything you need, in one place",
    features: [
      {
        title: "Club Management",
        desc: "Create university clubs, add members, and track each club's activity with a dedicated president dashboard.",
        gradient: "from-violet-500 to-purple-700",
      },
      {
        title: "Events & Workshops",
        desc: "Plan events, register attendance, and collect real-time ratings for every workshop or activity.",
        gradient: "from-cyan-500 to-teal-600",
      },
      {
        title: "AI Weekly Challenges",
        desc: "The system auto-generates MCQ challenges for each club weekly and displays a leaderboard of top members.",
        gradient: "from-amber-400 to-orange-500",
      },
      {
        title: "Advanced Analytics",
        desc: "Track membership, attendance, and rating rates — all scoped per university and club.",
        gradient: "from-emerald-500 to-green-700",
      },
    ],
    icons: [Users, CalendarDays, Sparkles, BarChart3],
    stepsLabel: "How to start?",
    stepsTitle: "Three simple steps",
    steps: [
      { n: "1", title: "Create your account", desc: "Sign up with your university email and you'll be linked to your university automatically." },
      { n: "2", title: "Join a club", desc: "Browse your university's clubs and send a join request. The president approves you in one click." },
      { n: "3", title: "Participate & thrive", desc: "Register for events, rate them, and compete in weekly AI challenges." },
    ],
    ctaTitle: "Are you a university admin or club president?",
    ctaDesc: "Contact us to add your university to the platform and activate all features for your clubs.",
    ctaBtn: "Create an account",
    footerRights: `© ${new Date().getFullYear()} Lafif. All rights reserved.`,
    langToggle: "عربي",
  },
};

type Lang = "ar" | "en";

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>("ar");
  const t = CONTENT[lang];
  const isRTL = t.dir === "rtl";

  return (
    <div className="min-h-screen bg-[#F7F5FF] font-sans" dir={t.dir} lang={t.lang}>

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-3xl font-black text-[#21166A]">{t.logo}</span>

          <nav className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold text-gray-500 hover:bg-[#EFE8F7] hover:text-[#21166A] transition border border-gray-100"
            >
              <Globe size={13} />
              {t.langToggle}
            </button>

            <Link
              href="/login"
              className="px-5 py-2.5 rounded-2xl text-sm font-bold text-[#21166A] hover:bg-[#EFE8F7] transition"
            >
              {t.nav.login}
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 rounded-2xl text-sm font-bold bg-[#21166A] text-white hover:opacity-90 transition shadow"
            >
              {t.nav.register}
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-20 pb-24 px-6">
        <div className="absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full bg-purple-300/25 blur-3xl" />
        <div className="absolute top-10 -left-20 w-[380px] h-[380px] rounded-full bg-emerald-200/20 blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-purple-100 shadow-sm text-xs font-bold text-[#7C3AED] mb-8">
            <Zap size={13} />
            {t.heroBadge}
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-[#21166A] leading-tight mb-6">
            {t.heroTitle1}
            <br />
            <span className="bg-gradient-to-l from-[#7C3AED] to-[#22C55E] bg-clip-text text-transparent">
              {t.heroTitle2}
            </span>
          </h1>

          <p className="text-lg text-gray-500 leading-9 max-w-2xl mx-auto mb-10">
            {t.heroSub}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#21166A] text-white text-base font-bold hover:opacity-90 transition shadow-xl shadow-purple-900/20"
            >
              {t.ctaPrimary}
              {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white border border-gray-200 text-[#21166A] text-base font-bold hover:border-purple-300 transition shadow"
            >
              {t.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="py-6 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4">
          {t.stats.map(({ value, label }) => (
            <div key={label} className="bg-white rounded-[24px] p-5 shadow-md border border-gray-50 text-center">
              <p className="text-2xl font-black text-[#21166A]">{value}</p>
              <p className="text-xs text-gray-400 font-bold mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-[#7C3AED] mb-2">{t.featuresLabel}</p>
            <h2 className="text-3xl font-black text-[#21166A]">{t.featuresTitle}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {t.features.map(({ title, desc, gradient }, i) => {
              const Icon = t.icons[i];
              return (
                <div key={title} className="bg-white rounded-[28px] p-6 shadow-md border border-gray-50 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="text-base font-black text-[#21166A] mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-7">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-[#7C3AED] mb-2">{t.stepsLabel}</p>
            <h2 className="text-3xl font-black text-[#21166A]">{t.stepsTitle}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.steps.map(({ n, title, desc }) => (
              <div key={n} className="text-center">
                <div className="w-14 h-14 rounded-[20px] bg-[#21166A] text-white text-2xl font-black flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-900/20">
                  {n}
                </div>
                <h3 className="text-base font-black text-[#21166A] mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-7">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-[36px] bg-[#21166A] p-10 text-center shadow-2xl shadow-purple-900/30">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-[20px] bg-white/10 flex items-center justify-center mx-auto mb-5">
                <GraduationCap size={28} className="text-white" />
              </div>
              <h2 className="text-2xl font-black text-white mb-3">{t.ctaTitle}</h2>
              <p className="text-sm text-white/70 leading-8 mb-8">{t.ctaDesc}</p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-[#21166A] text-sm font-black hover:bg-[#EFE8F7] transition shadow-xl"
              >
                <ShieldCheck size={16} />
                {t.ctaBtn}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-2xl font-black text-[#21166A]">{t.logo}</span>
          <p className="text-xs text-gray-400">{t.footerRights}</p>
          <div className="flex gap-5 text-xs font-bold text-gray-400">
            <Link href="/login" className="hover:text-[#21166A] transition">{t.nav.login}</Link>
            <Link href="/register" className="hover:text-[#21166A] transition">{t.nav.register}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

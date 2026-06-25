"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  doc, getDoc, collection, query, where, getDocs,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { useAuth } from "@/features/auth/context/AuthContext";
import {
  CheckCircle, XCircle, Clock, Trophy,
  ArrowRight, Zap, Medal, ChevronLeft,
} from "lucide-react";
import { submitChallenge, getExistingSubmission } from "../services/submitChallenge.service";
import { getQuestionsForCategory } from "../utils/questionBank";
import ChallengeCertificate from "./ChallengeCertificate";
import type {
  ChallengeType, MCQQuestion, ChallengeSubmission,
} from "../types/challenge.types";

type PageState = "loading" | "no-access" | "quiz" | "submitting" | "result";

type LeaderboardEntry = {
  id: string;
  userName: string;
  score: number;
  timeSeconds: number;
  correctCount: number;
  totalQuestions: number;
};

function fmtTime(s: number): string {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

function weekKeyFromId(challengeId: string): string {
  const m = challengeId.match(/_(\d{4}-\d{2})$/);
  return m ? m[1] : "";
}

function clubIdFromId(challengeId: string): string {
  const wk = `_${weekKeyFromId(challengeId)}`;
  return challengeId.endsWith(wk)
    ? challengeId.slice(0, -wk.length)
    : challengeId;
}

/* ─── Rank badge colors ──────────────────────────────────────────────── */
const RANK_STYLE = [
  "bg-amber-400 text-white",
  "bg-gray-300 text-gray-800",
  "bg-orange-400 text-white",
];

/* ─── Option button ──────────────────────────────────────────────────── */
function OptionBtn({
  label, text, onClick, state,
}: {
  label: string;
  text: string;
  onClick?: () => void;
  state: "idle" | "selected" | "correct" | "wrong";
}) {
  const base =
    "w-full text-right flex items-center gap-4 px-5 py-4 rounded-2xl border-2 font-bold text-sm transition-all";
  const styles: Record<typeof state, string> = {
    idle:     "border-gray-100 bg-white text-[#21166A] hover:border-purple-300 hover:bg-[#F7F5FF] cursor-pointer",
    selected: "border-[#7C3AED] bg-[#EFE8F7] text-[#21166A]",
    correct:  "border-emerald-400 bg-emerald-50 text-emerald-700",
    wrong:    "border-red-300 bg-red-50 text-red-600",
  };
  return (
    <button
      onClick={state === "idle" ? onClick : undefined}
      className={`${base} ${styles[state]}`}
      disabled={state !== "idle"}
    >
      <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
        state === "correct" ? "bg-emerald-500 text-white" :
        state === "wrong"   ? "bg-red-400 text-white" :
        state === "selected" ? "bg-[#7C3AED] text-white" :
        "bg-gray-100 text-gray-500"
      }`}>
        {label}
      </span>
      {text}
    </button>
  );
}

const OPT_LABELS = ["أ", "ب", "ج", "د"];

/* ─── Main component ─────────────────────────────────────────────────── */
export default function ChallengePage({
  challengeId,
}: {
  challengeId: string;
}) {
  const { user, profile } = useAuth();
  const router = useRouter();

  const [pageState, setPageState] = useState<PageState>("loading");
  const [challenge, setChallenge] =
    useState<(ChallengeType & { questions: MCQQuestion[] }) | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [pickedOption, setPickedOption] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [collectedAnswers, setCollectedAnswers] = useState<number[]>([]);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [submission, setSubmission] = useState<ChallengeSubmission | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const startMsRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Load challenge & check prior submission ─────────────────────── */
  const loadLeaderboard = useCallback(async () => {
    const q = query(
      collection(db, "challengeSubmissions"),
      where("challengeId", "==", challengeId)
    );
    const snap = await getDocs(q);
    const entries = snap.docs
      .map((d) => ({ id: d.id, ...(d.data() as Omit<LeaderboardEntry, "id">) }))
      .sort((a, b) =>
        b.score !== a.score ? b.score - a.score : a.timeSeconds - b.timeSeconds
      )
      .slice(0, 10);
    setLeaderboard(entries);
  }, [challengeId]);

  useEffect(() => {
    if (!user) return;

    async function load() {
      // 1. Load challenge doc
      const snap = await getDoc(doc(db, "challenges", challengeId));
      if (!snap.exists()) { router.push("/dashboard"); return; }

      const raw = snap.data() as ChallengeType & { questions?: MCQQuestion[] };

      // 2. Ensure questions exist (fallback: generate from bank)
      const questions: MCQQuestion[] =
        Array.isArray(raw.questions) && raw.questions.length > 0
          ? raw.questions
          : getQuestionsForCategory(raw.category, 5);

      const ch = { ...raw, questions };
      setChallenge(ch);

      // 3. Check if user already submitted
      const prior = await getExistingSubmission(user!.uid, challengeId);
      if (prior) {
        setSubmission(prior);
        await loadLeaderboard();
        setPageState("result");
        return;
      }

      // 4. Access check: must be a member/president/VP of this club
      const clubId = clubIdFromId(challengeId);
      const isMember =
        profile?.clubId === clubId &&
        ["member", "president", "vicePresident"].includes(profile?.role ?? "");

      if (!isMember) {
        setPageState("no-access");
        return;
      }

      // 5. Start quiz
      startMsRef.current = Date.now();
      setPageState("quiz");
    }

    load();
  }, [user?.uid, challengeId]);

  /* ── Timer ───────────────────────────────────────────────────────── */
  useEffect(() => {
    if (pageState !== "quiz") return;
    timerRef.current = setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startMsRef.current) / 1000));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pageState]);

  /* ── Handlers ────────────────────────────────────────────────────── */
  function handleSelect(idx: number) {
    if (confirmed) return;
    setPickedOption(idx);
    setConfirmed(true);
  }

  async function handleNext() {
    if (pickedOption === null) return;

    const newAnswers = [...collectedAnswers, pickedOption];
    setCollectedAnswers(newAnswers);

    if (currentQ < (challenge?.questions.length ?? 1) - 1) {
      // Go to next question
      setCurrentQ((q) => q + 1);
      setPickedOption(null);
      setConfirmed(false);
    } else {
      // Last question — submit
      if (timerRef.current) clearInterval(timerRef.current);
      const finalTime = Math.floor((Date.now() - startMsRef.current) / 1000);
      setPageState("submitting");

      try {
        const result = await submitChallenge({
          userId:       user!.uid,
          userName:     profile?.name ?? "مجهول",
          clubId:       clubIdFromId(challengeId),
          universityId: profile?.universityId ?? "",
          weekKey:      weekKeyFromId(challengeId),
          challengeId,
          answers:      newAnswers,
          questions:    challenge!.questions,
          totalPoints:  challenge!.points,
          timeSeconds:  finalTime,
        });
        setSubmission(result);
        await loadLeaderboard();
        setPageState("result");
      } catch {
        setPageState("quiz"); // let them retry on network error
      }
    }
  }

  /* ── Option state helper ─────────────────────────────────────────── */
  function optionState(
    idx: number
  ): "idle" | "selected" | "correct" | "wrong" {
    if (!confirmed) return "idle";
    const correct = challenge!.questions[currentQ].correctIndex;
    if (idx === correct) return "correct";
    if (idx === pickedOption) return "wrong";
    return "idle";
  }

  /* ══════════════════════════════════════════════════════════════════ */
  /* Render states                                                      */
  /* ══════════════════════════════════════════════════════════════════ */

  if (pageState === "loading" || pageState === "submitting") {
    return (
      <div className="min-h-screen bg-[#F7F5FF] flex items-center justify-center">
        <div className="text-center" dir="rtl">
          <div className="w-16 h-16 rounded-[20px] bg-white shadow-md flex items-center justify-center mx-auto mb-4">
            <Zap size={28} className="text-[#7C3AED]" />
          </div>
          <p className="font-black text-[#21166A]">
            {pageState === "submitting" ? "جاري حفظ إجابتك..." : "جاري التحميل..."}
          </p>
        </div>
      </div>
    );
  }

  if (pageState === "no-access") {
    return (
      <div className="min-h-screen bg-[#F7F5FF] flex items-center justify-center p-6" dir="rtl">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-[24px] bg-white shadow-md flex items-center justify-center mx-auto mb-4">
            <XCircle size={28} className="text-red-400" />
          </div>
          <h2 className="text-lg font-black text-[#21166A] mb-2">لا يمكن الوصول</h2>
          <p className="text-sm text-gray-500 mb-6">
            يجب أن تكون عضواً في النادي للمشاركة في التحدي الأسبوعي.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#21166A] text-white text-sm font-bold hover:opacity-90 transition"
          >
            <ArrowRight size={16} />
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  /* ── Result screen ───────────────────────────────────────────────── */
  if (pageState === "result" && submission && challenge) {
    const pct = Math.round((submission.correctCount / submission.totalQuestions) * 100);
    const userRank = leaderboard.findIndex((e) => e.id === submission.id) + 1;

    return (
      <div className="min-h-screen bg-[#F7F5FF]">

        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between max-w-2xl mx-auto" dir="rtl">
            <span className="text-2xl font-black text-[#21166A]">لفيف</span>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#F7F5FF] border border-gray-100 text-sm font-bold text-gray-500 hover:bg-[#EFE8F7] hover:text-[#21166A] transition"
            >
              <ArrowRight size={15} />
              الرئيسية
            </Link>
          </div>
        </header>

        <div className="max-w-2xl mx-auto p-6 space-y-5" dir="rtl">

          {/* Score hero */}
          <div className="relative overflow-hidden bg-[#21166A] rounded-[28px] p-8 text-center shadow-xl shadow-purple-900/25">
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <Trophy size={36} className="text-amber-400 mx-auto mb-3" />
              <p className="text-white/60 text-sm font-bold mb-1">نقاطك في هذا الأسبوع</p>
              <h1 className="text-6xl font-black text-white mb-4">{submission.score}</h1>
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-bold">
                XP مكتسب
              </span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-[20px] p-4 shadow-md border border-gray-50 text-center">
              <CheckCircle size={20} className="text-emerald-500 mx-auto mb-2" />
              <p className="text-2xl font-black text-[#21166A]">
                {submission.correctCount}/{submission.totalQuestions}
              </p>
              <p className="text-xs text-gray-400 font-bold mt-1">إجابات صحيحة</p>
            </div>
            <div className="bg-white rounded-[20px] p-4 shadow-md border border-gray-50 text-center">
              <Zap size={20} className="text-amber-500 mx-auto mb-2" />
              <p className="text-2xl font-black text-[#21166A]">{pct}%</p>
              <p className="text-xs text-gray-400 font-bold mt-1">دقة الإجابة</p>
            </div>
            <div className="bg-white rounded-[20px] p-4 shadow-md border border-gray-50 text-center">
              <Clock size={20} className="text-[#7C3AED] mx-auto mb-2" />
              <p className="text-2xl font-black text-[#21166A]">{fmtTime(submission.timeSeconds)}</p>
              <p className="text-xs text-gray-400 font-bold mt-1">الوقت المستغرق</p>
            </div>
          </div>

          {/* Your rank */}
          {userRank > 0 && (
            <div className="bg-white rounded-[20px] p-4 shadow-md border border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Medal size={20} className="text-[#7C3AED]" />
                <p className="text-sm font-bold text-gray-500">ترتيبك في التحدي</p>
              </div>
              <span className="text-xl font-black text-[#21166A]">#{userRank}</span>
            </div>
          )}

          {/* Leaderboard */}
          <div className="bg-white rounded-[24px] p-5 shadow-md border border-gray-50">
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={16} className="text-amber-500" />
              <h2 className="text-base font-black text-[#21166A]">ترتيب الأسبوع</h2>
              <span className="mr-auto text-xs text-gray-400 font-bold">{leaderboard.length} مشارك</span>
            </div>

            {leaderboard.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">لا توجد مشاركات بعد</p>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((entry, i) => {
                  const isMe = entry.id === submission.id;
                  return (
                    <div
                      key={entry.id}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
                        isMe ? "bg-[#EFE8F7] border border-purple-200" : "bg-gray-50"
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center shrink-0 ${
                        RANK_STYLE[i] ?? "bg-gray-100 text-gray-600"
                      }`}>
                        {i + 1}
                      </span>
                      <span className={`flex-1 text-sm font-bold truncate ${isMe ? "text-[#21166A]" : "text-gray-700"}`}>
                        {isMe ? `${entry.userName} (أنت)` : entry.userName}
                      </span>
                      <span className="text-sm font-black text-[#7C3AED] shrink-0">
                        {entry.score} XP
                      </span>
                      <span className="text-xs text-gray-400 shrink-0 w-12 text-left">
                        {fmtTime(entry.timeSeconds)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Certificate */}
          <ChallengeCertificate
            submission={submission}
            userName={profile?.name ?? "مشارك"}
            clubName={submission.clubId}
            universityName={profile?.universityName ?? ""}
          />
        </div>
      </div>
    );
  }

  /* ── Quiz screen ─────────────────────────────────────────────────── */
  if (pageState !== "quiz" || !challenge) return null;

  const q = challenge.questions[currentQ];
  const total = challenge.questions.length;
  const progress = ((currentQ + (confirmed ? 1 : 0)) / total) * 100;

  return (
    <div className="min-h-screen bg-[#F7F5FF] flex flex-col">

      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="px-6 py-4 max-w-2xl mx-auto" dir="rtl">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-bold text-[#7C3AED]">{challenge.title}</p>
              <p className="text-sm font-black text-[#21166A]">
                السؤال {currentQ + 1} من {total}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-[#F7F5FF] border border-gray-100 px-3 py-2 rounded-2xl">
              <Clock size={14} className="text-[#7C3AED]" />
              <span className="text-sm font-black text-[#21166A] tabular-nums">
                {fmtTime(elapsedSec)}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-l from-[#7C3AED] to-[#22C55E] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Question + options */}
      <div className="flex-1 p-6 max-w-2xl mx-auto w-full" dir="rtl">

        {/* Question card */}
        <div className="bg-white rounded-[24px] p-6 shadow-md border border-gray-50 mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFE8F7] text-xs font-bold text-[#7C3AED] mb-4">
            <Zap size={11} />
            {challenge.difficulty} — {challenge.challengeType}
          </div>
          <p className="text-base font-black text-[#21166A] leading-8">{q.question}</p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {q.options.map((opt, idx) => (
            <OptionBtn
              key={idx}
              label={OPT_LABELS[idx]}
              text={opt}
              onClick={() => handleSelect(idx)}
              state={optionState(idx)}
            />
          ))}
        </div>

        {/* Feedback hint */}
        {confirmed && (
          <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl mb-5 text-sm font-bold ${
            pickedOption === q.correctIndex
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-600 border border-red-200"
          }`}>
            {pickedOption === q.correctIndex
              ? <><CheckCircle size={16} /> إجابة صحيحة! 🎉</>
              : <><XCircle size={16} /> الإجابة الصحيحة: {q.options[q.correctIndex]}</>
            }
          </div>
        )}

        {/* Next / Submit button */}
        {confirmed && (
          <button
            onClick={handleNext}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#21166A] text-white font-bold hover:opacity-90 transition shadow-lg shadow-purple-900/20"
          >
            {currentQ < total - 1 ? "السؤال التالي" : "إرسال الإجابات"}
            <ChevronLeft size={18} />
          </button>
        )}

        {!confirmed && (
          <div className="text-center text-xs text-gray-400 font-bold py-3">
            اختر إجابتك للمتابعة
          </div>
        )}
      </div>
    </div>
  );
}

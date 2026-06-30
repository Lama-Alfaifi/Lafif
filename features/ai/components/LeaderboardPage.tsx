"use client";

import { useState } from "react";
import { Trophy, Star, Zap, Users, BarChart2, Medal } from "lucide-react";
import Sidebar from "@/features/dashboard/components/Sidebar";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useLanguage } from "@/features/i18n/context/LanguageContext";
import usePlayerLeaderboard from "../hooks/usePlayerLeaderboard";
import useLeaderboard from "../hooks/useLeaderboard";

type Tab = "members" | "clubs";

const RANK_STYLE: Record<number, string> = {
  0: "bg-amber-400 text-white shadow-lg shadow-amber-200",
  1: "bg-gray-300 text-gray-700 shadow",
  2: "bg-orange-400 text-white shadow",
};

const RANK_ICON: Record<number, string> = { 0: "🥇", 1: "🥈", 2: "🥉" };

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-gray-50 animate-pulse">
      <div className="w-8 h-8 rounded-xl bg-gray-200" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-32 rounded-full bg-gray-200" />
        <div className="h-2 w-20 rounded-full bg-gray-100" />
      </div>
      <div className="h-6 w-14 rounded-full bg-gray-200" />
    </div>
  );
}

export default function LeaderboardPage() {
  const { user, profile } = useAuth();
  const { t, dir } = useLanguage();
  const [tab, setTab] = useState<Tab>("members");

  const { players, loading: playersLoading } = usePlayerLeaderboard();
  const clubs = useLeaderboard() as {
    id: string; name?: string; score?: number;
    category?: string; college?: string;
  }[];

  const myRank = players.findIndex((p) => p.userId === user?.uid) + 1;

  return (
    <div className="flex min-h-screen bg-[#F7F5FF]">
      <div className="flex-1 min-w-0 flex flex-col">

        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
          <div className="px-8 py-4 flex items-center justify-between" dir={dir}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[14px] bg-[#EFE8F7] flex items-center justify-center shrink-0">
                <Trophy size={18} className="text-[#7C3AED]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#7C3AED] mb-0.5">
                  {profile?.universityName}
                </p>
                <h1 className="text-xl font-black text-[#21166A]">{t.leaderboard.title}</h1>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setTab("members")}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition ${
                  tab === "members"
                    ? "bg-[#21166A] text-white shadow"
                    : "bg-[#F7F5FF] text-gray-500 border border-gray-100 hover:bg-[#EFE8F7]"
                }`}
              >
                <Users size={13} />
                {t.leaderboard.membersTab}
              </button>
              <button
                onClick={() => setTab("clubs")}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition ${
                  tab === "clubs"
                    ? "bg-[#21166A] text-white shadow"
                    : "bg-[#F7F5FF] text-gray-500 border border-gray-100 hover:bg-[#EFE8F7]"
                }`}
              >
                <BarChart2 size={13} />
                {t.leaderboard.clubsTab}
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-8" dir={dir}>
          <div className="max-w-2xl mx-auto space-y-5">

            {tab === "members" && (
              <>
                {myRank > 0 && (
                  <div className="relative overflow-hidden bg-[#21166A] rounded-[24px] p-5 shadow-xl shadow-purple-900/20">
                    <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-purple-400/20 blur-3xl pointer-events-none" />
                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <p className="text-white/50 text-xs font-bold mb-1">{t.leaderboard.yourCurRank}</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-black text-white">#{myRank}</span>
                          <span className="text-white/60 text-sm font-bold">
                            {t.leaderboard.ofParticipants.replace("{n}", String(players.length))}
                          </span>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-white/50 text-xs font-bold mb-1">{t.leaderboard.yourScore}</p>
                        <div className="flex items-center gap-1.5">
                          <Zap size={16} className="text-amber-400" />
                          <span className="text-2xl font-black text-white">
                            {players[myRank - 1]?.totalScore ?? 0}
                          </span>
                          <span className="text-white/50 text-xs font-bold">XP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!playersLoading && players.length >= 3 && (
                  <div className="grid grid-cols-3 gap-3">
                    {[players[1], players[0], players[2]].map((p, col) => {
                      if (!p) return <div key={col} />;
                      const rank = col === 1 ? 0 : col === 0 ? 1 : 2;
                      return (
                        <div
                          key={p.userId}
                          className={`flex flex-col items-center gap-2 p-4 rounded-[20px] shadow-md ${
                            rank === 0
                              ? "bg-gradient-to-b from-amber-50 to-white border border-amber-100"
                              : "bg-white border border-gray-50"
                          }`}
                        >
                          <span className="text-2xl">{RANK_ICON[rank]}</span>
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#21166A] to-[#7C3AED] text-white text-sm font-black flex items-center justify-center">
                            {p.userName[0]}
                          </div>
                          <p className="text-xs font-black text-[#21166A] text-center truncate w-full">
                            {p.userName}
                          </p>
                          <span className="text-sm font-black text-[#7C3AED]">
                            {p.totalScore} XP
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="bg-white rounded-[24px] shadow-md border border-gray-50 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
                    <Medal size={15} className="text-[#7C3AED]" />
                    <h2 className="text-sm font-black text-[#21166A]">{t.leaderboard.fullRanking}</h2>
                    <span className="mr-auto text-xs text-gray-400 font-bold">
                      {players.length} {t.leaderboard.participant}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    {playersLoading
                      ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                      : players.length === 0
                      ? (
                        <div className="text-center py-8">
                          <Trophy size={28} className="text-gray-200 mx-auto mb-2" />
                          <p className="text-sm text-gray-400 font-bold">{t.leaderboard.noData}</p>
                          <p className="text-xs text-gray-300 mt-1">{t.leaderboard.noDataSub}</p>
                        </div>
                      )
                      : players.map((p, i) => {
                        const isMe = p.userId === user?.uid;
                        return (
                          <div
                            key={p.userId}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
                              isMe
                                ? "bg-[#EFE8F7] border border-purple-200"
                                : "bg-gray-50 hover:bg-[#F7F5FF]"
                            }`}
                          >
                            <span className={`w-8 h-8 rounded-xl text-xs font-black flex items-center justify-center shrink-0 ${
                              RANK_STYLE[i] ?? "bg-gray-100 text-gray-500"
                            }`}>
                              {i < 3 ? RANK_ICON[i] : i + 1}
                            </span>

                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#21166A] to-[#7C3AED] text-white text-xs font-black flex items-center justify-center shrink-0">
                              {p.userName[0]}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-black truncate ${isMe ? "text-[#21166A]" : "text-gray-700"}`}>
                                {isMe ? `${p.userName} (${t.leaderboard.you})` : p.userName}
                              </p>
                              <p className="text-[10px] text-gray-400 font-bold">
                                {p.clubName} · {p.challengeCount} {t.leaderboard.challenges} · {t.leaderboard.accuracy} {p.avgAccuracy}%
                              </p>
                            </div>

                            <div className="text-left shrink-0">
                              <div className="flex items-center gap-1">
                                <Zap size={12} className="text-amber-500" />
                                <span className="text-sm font-black text-[#7C3AED]">
                                  {p.totalScore}
                                </span>
                              </div>
                              <p className="text-[10px] text-gray-400 font-bold text-left">XP</p>
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              </>
            )}

            {tab === "clubs" && (
              <div className="bg-white rounded-[24px] shadow-md border border-gray-50 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
                  <Star size={15} className="text-amber-500" />
                  <h2 className="text-sm font-black text-[#21166A]">{t.leaderboard.clubsTab}</h2>
                  <span className="mr-auto text-xs text-gray-400 font-bold">
                    {clubs.length} {t.leaderboard.club}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  {clubs.length === 0 ? (
                    <div className="text-center py-8">
                      <BarChart2 size={28} className="text-gray-200 mx-auto mb-2" />
                      <p className="text-sm text-gray-400 font-bold">{t.leaderboard.noClubsData}</p>
                    </div>
                  ) : clubs.map((club, i) => (
                    <div
                      key={club.id}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-50 hover:bg-[#F7F5FF] transition"
                    >
                      <span className={`w-8 h-8 rounded-xl text-xs font-black flex items-center justify-center shrink-0 ${
                        RANK_STYLE[i] ?? "bg-gray-100 text-gray-500"
                      }`}>
                        {i < 3 ? RANK_ICON[i] : i + 1}
                      </span>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-[#21166A] truncate">
                          {club.name}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold">
                          {club.college ?? "—"} · {club.category === "central" ? t.leaderboard.central : t.leaderboard.decentralized}
                        </p>
                      </div>

                      <div className="text-left shrink-0">
                        <p className="text-sm font-black text-emerald-600">
                          {club.score ?? 0}
                        </p>
                        <p className="text-[10px] text-gray-400 text-left">{t.leaderboard.points}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Sidebar />
    </div>
  );
}

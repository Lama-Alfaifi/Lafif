"use client";

import { useState, useEffect } from "react";
import {
  CalendarDays, Clock, MapPin, Users,
  Star, CheckCircle, AlertCircle, Loader2,
} from "lucide-react";

import { useAuth } from "@/features/auth/context/AuthContext";
import useAttendance from "../hooks/useAttendance";
import { useEventRating } from "../hooks/useEventRating";
import { registerAttendance } from "../services/registrations.service";
import { submitRating } from "../services/ratings.service";
import type { EventItem } from "../types/event.types";

const MONTHS_AR = [
  "يناير","فبراير","مارس","أبريل","مايو","يونيو",
  "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر",
];

function isEventPast(event: EventItem): boolean {
  const now = new Date();
  const d = new Date(event.year ?? 2025, (event.month ?? 1) - 1, event.day);
  return d < new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function StarRow({
  value,
  interactive,
  hovered,
  filled,
  onHover,
  onClick,
  disabled,
}: {
  value: number;
  interactive: boolean;
  hovered: number;
  filled: number;
  onHover: (v: number) => void;
  onClick: (v: number) => void;
  disabled: boolean;
}) {
  const active = interactive ? (hovered || filled) >= value : filled >= value;
  return (
    <button
      type="button"
      disabled={disabled || !interactive}
      onClick={() => onClick(value)}
      onMouseEnter={() => onHover(value)}
      onMouseLeave={() => onHover(0)}
      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
        active
          ? "bg-amber-100 text-amber-500 scale-110"
          : "bg-gray-50 text-gray-300"
      } ${interactive && !disabled ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
    >
      <Star size={18} fill={active ? "currentColor" : "none"} />
    </button>
  );
}

type Props = {
  selectedEvent: EventItem | null;
  onStatsRefresh?: () => void;
};

export default function EventDetailsCard({ selectedEvent, onStatsRefresh }: Props) {
  const { user, profile } = useAuth();
  const { hasAttended, setHasAttended } = useAttendance(selectedEvent?.id);
  const { myRating, stats, reload: reloadRating } = useEventRating(user?.uid, selectedEvent?.id);

  const [hovered, setHovered]     = useState(0);
  const [picked, setPicked]       = useState(0);
  const [comment, setComment]     = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [attendLoading, setAttendLoading] = useState(false);
  const [msg, setMsg]             = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Sync existing rating into local state
  useEffect(() => {
    if (myRating) {
      setPicked(myRating.rating);
      setComment(myRating.comment ?? "");
    } else {
      setPicked(0);
      setComment("");
    }
    setMsg(null);
  }, [myRating, selectedEvent?.id]);

  if (!selectedEvent) {
    return (
      <div className="bg-white rounded-[24px] p-6 shadow-md border border-gray-50 flex items-center justify-center min-h-[200px]" dir="rtl">
        <p className="text-sm text-gray-400 font-bold">اختر فعالية لعرض تفاصيلها</p>
      </div>
    );
  }

  const isPast      = isEventPast(selectedEvent);
  const alreadyRated = !!myRating;
  const canRate     = hasAttended && isPast;
  const monthName   = MONTHS_AR[(selectedEvent.month ?? 1) - 1];

  async function handleAttend() {
    setAttendLoading(true);
    setMsg(null);
    try {
      await registerAttendance(
        selectedEvent!.id,
        selectedEvent!.title,
        profile?.universityId ?? "",
        selectedEvent!.clubId ?? "",
        selectedEvent!.clubName ?? ""
      );
      setHasAttended(true);
      onStatsRefresh?.();
      setMsg({ type: "ok", text: "تم تسجيل حضورك بنجاح ✓" });
    } catch (e: unknown) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "حدث خطأ" });
    } finally {
      setAttendLoading(false);
    }
  }

  async function handleRating() {
    if (!picked || !user) return;
    setSubmitting(true);
    setMsg(null);
    try {
      await submitRating(
        selectedEvent!.id,
        selectedEvent!.title,
        profile?.universityId ?? "",
        selectedEvent!.clubId ?? "",
        selectedEvent!.clubName ?? "",
        picked,
        { userId: user.uid, userName: profile?.name, comment }
      );
      await reloadRating();
      onStatsRefresh?.();
      setMsg({ type: "ok", text: "تم حفظ تقييمك شكراً لك!" });
    } catch (e: unknown) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "حدث خطأ" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-[24px] shadow-md border border-gray-50 overflow-hidden" dir="rtl">

      {/* Header band */}
      <div className="relative bg-[#21166A] px-6 py-5 overflow-hidden">
        <div className="absolute -top-8 -left-8 w-28 h-28 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <span className={`inline-block mb-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              selectedEvent.type === "public" ? "bg-emerald-400/20 text-emerald-300" : "bg-red-400/20 text-red-300"
            }`}>
              {selectedEvent.type === "public" ? "عامة" : "للأعضاء فقط"}
            </span>
            <h2 className="text-base font-black text-white leading-6 truncate">
              {selectedEvent.title}
            </h2>
          </div>
          <div className="shrink-0 text-center bg-white/10 rounded-[14px] px-3 py-2">
            <p className="text-2xl font-black text-white leading-none">{selectedEvent.day}</p>
            <p className="text-[10px] font-bold text-white/60 mt-0.5">{monthName}</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">

        {/* Meta */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: <Clock size={13} />,       label: selectedEvent.time },
            { icon: <MapPin size={13} />,      label: selectedEvent.place },
            { icon: <Users size={13} />,       label: selectedEvent.clubName },
            { icon: <CalendarDays size={13} />, label: `${selectedEvent.day}/${selectedEvent.month}/${selectedEvent.year}` },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2 bg-[#F7F5FF] rounded-2xl px-3 py-2.5">
              <span className="text-[#7C3AED] shrink-0">{icon}</span>
              <span className="text-xs font-bold text-gray-600 truncate">{label}</span>
            </div>
          ))}
        </div>

        {/* Description */}
        {selectedEvent.description && (
          <p className="text-xs text-gray-500 leading-6 bg-[#F7F5FF] rounded-2xl px-4 py-3">
            {selectedEvent.description}
          </p>
        )}

        {/* Attend button */}
        <button
          onClick={handleAttend}
          disabled={hasAttended || attendLoading}
          className={`w-full py-3 rounded-2xl text-sm font-bold transition flex items-center justify-center gap-2 ${
            hasAttended
              ? "bg-emerald-50 text-emerald-600 cursor-default"
              : "bg-[#21166A] text-white hover:opacity-90 shadow-md shadow-purple-900/20"
          }`}
        >
          {attendLoading ? (
            <><Loader2 size={15} className="animate-spin" /> جاري التسجيل...</>
          ) : hasAttended ? (
            <><CheckCircle size={15} /> تم تسجيل حضورك</>
          ) : "تسجيل حضور"}
        </button>

        {/* ── Rating section ─────────────────────────────────────────── */}
        <div className="border-t border-gray-50 pt-4">

          {/* Aggregate stars */}
          {stats && stats.count > 0 && (
            <div className="flex items-center gap-3 mb-4 bg-amber-50 rounded-2xl px-4 py-3">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={14} className="text-amber-400"
                    fill={s <= Math.round(stats.avg) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-sm font-black text-amber-700">{stats.avg}</span>
              <span className="text-xs text-amber-500 font-bold">({stats.count} تقييم)</span>
            </div>
          )}

          <p className="text-sm font-black text-[#21166A] mb-1">تقييم الفعالية</p>

          {!isPast && (
            <p className="text-xs text-gray-400 font-bold py-2">
              التقييم يُفتح بعد انتهاء الفعالية
            </p>
          )}

          {isPast && !hasAttended && (
            <p className="text-xs text-amber-600 font-bold bg-amber-50 rounded-2xl px-3 py-2">
              سجّل حضورك أولاً لتتمكن من التقييم
            </p>
          )}

          {canRate && (
            <div className="space-y-3 mt-2">
              {/* Stars row */}
              <div className="flex gap-1.5">
                {[1,2,3,4,5].map((v) => (
                  <StarRow
                    key={v}
                    value={v}
                    interactive={!alreadyRated}
                    hovered={hovered}
                    filled={picked}
                    onHover={alreadyRated ? () => {} : setHovered}
                    onClick={alreadyRated ? () => {} : setPicked}
                    disabled={submitting}
                  />
                ))}
                {picked > 0 && (
                  <span className="mr-2 self-center text-sm font-black text-amber-500">
                    {["","ضعيف","مقبول","جيد","جيد جداً","ممتاز"][picked]}
                  </span>
                )}
              </div>

              {/* Comment */}
              {!alreadyRated && (
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={2}
                  placeholder="اكتب تعليقاً (اختياري)..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-gray-100 bg-[#F7F5FF] text-xs font-bold text-[#21166A] placeholder:text-gray-300 outline-none resize-none focus:border-purple-200 transition"
                />
              )}

              {alreadyRated ? (
                <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold bg-emerald-50 rounded-2xl px-3 py-2">
                  <CheckCircle size={13} />
                  قيّمت هذه الفعالية بـ {myRating?.rating} نجوم
                  {myRating?.comment && <span className="text-gray-400"> — {myRating.comment}</span>}
                </div>
              ) : (
                <button
                  onClick={handleRating}
                  disabled={!picked || submitting}
                  className="w-full py-2.5 rounded-2xl bg-[#21166A] text-white text-xs font-bold hover:opacity-90 transition disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {submitting ? <><Loader2 size={13} className="animate-spin" />جاري الحفظ...</> : "إرسال التقييم"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Feedback toast */}
        {msg && (
          <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold ${
            msg.type === "ok"
              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
              : "bg-red-50 text-red-500 border border-red-100"
          }`}>
            {msg.type === "ok" ? <CheckCircle size={13} /> : <AlertCircle size={13} />}
            {msg.text}
          </div>
        )}
      </div>
    </div>
  );
}

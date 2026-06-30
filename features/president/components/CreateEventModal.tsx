"use client";

import { useState } from "react";
import { X, CalendarDays, CheckCircle } from "lucide-react";
import { createEvent } from "../services/createEvent.service";
import { useLanguage }  from "@/features/i18n/context/LanguageContext";

type Props = {
  onClose: () => void;
  onCreated?: () => void;
  clubId: string;
  clubName: string;
  universityId: string;
  universityName: string;
};

const INPUT_CLS =
  "w-full rounded-2xl border border-[#EEE7F8] bg-[#F8F6FC] px-4 py-3 outline-none text-sm text-[#21166A] focus:border-[#7C3AED] transition placeholder:text-gray-400";

export default function CreateEventModal({
  onClose,
  onCreated,
  clubId,
  clubName,
  universityId,
  universityName,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [place, setPlace] = useState("");
  const [date, setDate] = useState("");   // "YYYY-MM-DD"
  const [time, setTime] = useState("");   // "HH:MM"
  const [type, setType] = useState<"public" | "members">("public");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");
  const { t, dir } = useLanguage();

  async function handleCreate() {
    setError("");

    if (!title.trim() || !place.trim() || !date || !time) {
      setError(t.president.evtFillAll);
      return;
    }

    const [yearStr, monthStr, dayStr] = date.split("-");

    try {
      setLoading(true);
      await createEvent({
        title: title.trim(),
        description: description.trim(),
        place: place.trim(),
        time,
        type,
        day: Number(dayStr),
        month: Number(monthStr),
        year: Number(yearStr),
        clubId,
        clubName,
        universityId,
        universityName,
      });

      setSuccess(true);
      onCreated?.();

      setTimeout(onClose, 900);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm flex items-center justify-center p-5">
      <div
        className="w-full max-w-lg rounded-[32px] bg-white shadow-2xl border border-white/80 p-7 relative"
        dir={dir}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 w-9 h-9 rounded-2xl bg-[#F3F0FA] text-[#21166A] flex items-center justify-center hover:bg-[#E9E1F8] transition"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#21166A] flex items-center justify-center">
            <CalendarDays size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#21166A]">{t.president.createTitle}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{t.president.createSub}</p>
          </div>
        </div>

        <div className="space-y-3">
          <input
            placeholder={t.president.evtTitlePh}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={INPUT_CLS}
          />

          <input
            placeholder={t.president.evtPlacePh}
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            className={INPUT_CLS}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-400 mb-1 block">{t.president.evtDateLabel}</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={INPUT_CLS}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 mb-1 block">{t.president.evtTimeLabel}</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={INPUT_CLS}
              />
            </div>
          </div>

          <select
            value={type}
            onChange={(e) => setType(e.target.value as "public" | "members")}
            className={INPUT_CLS}
          >
            <option value="public">{t.president.evtPublicOpt}</option>
            <option value="members">{t.president.evtMembersOpt}</option>
          </select>

          <textarea
            placeholder={t.president.evtDescPh}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={`${INPUT_CLS} resize-none`}
          />
        </div>

        {error && (
          <p className="mt-3 text-xs font-bold text-red-500">{error}</p>
        )}

        <button
          onClick={handleCreate}
          disabled={loading || success}
          className={`
            mt-5 w-full rounded-2xl py-3 font-bold text-sm transition flex items-center justify-center gap-2
            ${success
              ? "bg-emerald-100 text-emerald-700"
              : "bg-[#21166A] text-white hover:opacity-90 disabled:opacity-60"
            }
          `}
        >
          {success ? (
            <>
              <CheckCircle size={16} />
              {t.president.evtCreated}
            </>
          ) : loading ? (
            t.president.evtCreating
          ) : (
            t.president.evtCreate
          )}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { X, Crown, UserCheck, Loader2, AlertCircle } from "lucide-react";
import { submitPositionRequest, type PositionType } from "../services/positionRequests.service";

type Props = {
  userId: string;
  userName: string;
  clubId: string;
  clubName: string;
  universityId: string;
  hasPendingVP: boolean;
  hasPendingPresident: boolean;
  onClose: () => void;
  onSubmitted: () => void;
};

const POSITIONS: {
  value: PositionType;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  accent: string;
  reviewedBy: string;
}[] = [
  {
    value: "vicePresident",
    label: "نائب الرئيس",
    sublabel: "يُراجَع من رئيس النادي",
    icon: <UserCheck size={20} />,
    accent: "border-[#7C3AED] bg-[#EFE8F7] text-[#7C3AED]",
    reviewedBy: "الرئيس",
  },
  {
    value: "president",
    label: "رئيس النادي",
    sublabel: "يُراجَع من أدمن الجامعة",
    icon: <Crown size={20} />,
    accent: "border-amber-400 bg-amber-50 text-amber-600",
    reviewedBy: "أدمن الجامعة",
  },
];

export default function RequestPositionModal({
  userId, userName, clubId, clubName, universityId,
  hasPendingVP, hasPendingPresident,
  onClose, onSubmitted,
}: Props) {
  const [position, setPosition] = useState<PositionType | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!position) return;
    setLoading(true);
    setError("");
    try {
      await submitPositionRequest({ userId, userName, clubId, clubName, universityId, position, message: message.trim() || undefined });
      onSubmitted();
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "حدث خطأ، حاول مجدداً.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" dir="rtl">
      <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="relative bg-[#21166A] px-6 py-5">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs font-bold mb-0.5">{clubName}</p>
              <h2 className="text-lg font-black text-white">طلب منصب</h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">

          {/* Position selector */}
          <div>
            <p className="text-xs font-bold text-gray-400 mb-3">اختر المنصب المطلوب</p>
            <div className="space-y-3">
              {POSITIONS.map((pos) => {
                const hasPending = pos.value === "vicePresident" ? hasPendingVP : hasPendingPresident;
                const isSelected = position === pos.value;

                return (
                  <button
                    key={pos.value}
                    disabled={hasPending}
                    onClick={() => setPosition(pos.value)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-right transition-all ${
                      hasPending
                        ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                        : isSelected
                        ? pos.accent
                        : "border-gray-100 bg-white hover:border-gray-200 cursor-pointer"
                    }`}
                  >
                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? "" : "bg-gray-100 text-gray-400"
                    }`}>
                      {pos.icon}
                    </span>
                    <div className="flex-1">
                      <p className="font-black text-sm text-[#21166A]">{pos.label}</p>
                      <p className="text-xs text-gray-400 font-bold mt-0.5">
                        {hasPending ? "لديك طلب معلّق" : pos.sublabel}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-current/20 border-2 border-current flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 rounded-full bg-current" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message */}
          <div>
            <p className="text-xs font-bold text-gray-400 mb-2">رسالة اختيارية</p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="اشرح لماذا تستحق هذا المنصب..."
              className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-[#F7F5FF] text-sm font-bold text-[#21166A] placeholder:text-gray-300 outline-none resize-none focus:border-purple-200 transition"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-gray-100 text-sm font-bold text-gray-500 hover:bg-gray-50 transition"
            >
              إلغاء
            </button>
            <button
              onClick={handleSubmit}
              disabled={!position || loading}
              className="flex-1 py-3 rounded-2xl bg-[#21166A] text-white text-sm font-bold hover:opacity-90 transition disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 size={15} className="animate-spin" /> جاري الإرسال</> : "إرسال الطلب"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

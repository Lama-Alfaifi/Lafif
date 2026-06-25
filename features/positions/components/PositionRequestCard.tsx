"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Crown, UserCheck, Clock, Loader2 } from "lucide-react";
import { reviewPositionRequest, type PositionRequest } from "../services/positionRequests.service";

type Props = {
  request: PositionRequest;
  reviewerUserId: string;
  onReviewed: () => void;
};

function initials(name?: string) {
  if (!name) return "؟";
  return name.trim().split(" ").slice(0, 2).map((w) => w[0]).join("");
}

function timeAgo(ts: unknown): string {
  if (!ts || typeof ts !== "object") return "";
  const date = (ts as { toDate?: () => Date }).toDate?.();
  if (!date) return "";
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "الآن";
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} د`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} س`;
  return `منذ ${Math.floor(diff / 86400)} ي`;
}

export default function PositionRequestCard({ request, reviewerUserId, onReviewed }: Props) {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  async function handle(decision: "approved" | "rejected") {
    setLoading(decision === "approved" ? "approve" : "reject");
    try {
      await reviewPositionRequest({
        requestId:  request.id,
        decision,
        reviewedBy: reviewerUserId,
        userId:     request.userId,
        clubId:     request.clubId,
        clubName:   request.clubName,
        position:   request.position,
      });
      onReviewed();
    } finally {
      setLoading(null);
    }
  }

  const isVP = request.position === "vicePresident";

  return (
    <div className="bg-white rounded-[20px] border border-gray-50 shadow-md p-5 flex flex-col gap-4" dir="rtl">

      {/* Top row */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#21166A] to-[#7C3AED] text-white text-sm font-black flex items-center justify-center shrink-0">
          {initials(request.userName)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-[#21166A] truncate">{request.userName}</p>
          <p className="text-xs text-gray-400 font-bold">{request.clubName}</p>
        </div>

        {/* Position badge */}
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black shrink-0 ${
          isVP ? "bg-[#EFE8F7] text-[#7C3AED]" : "bg-amber-50 text-amber-600"
        }`}>
          {isVP ? <UserCheck size={11} /> : <Crown size={11} />}
          {isVP ? "نائب رئيس" : "رئيس نادي"}
        </span>
      </div>

      {/* Message */}
      {request.message && (
        <p className="text-xs text-gray-500 leading-6 bg-[#F7F5FF] rounded-2xl px-4 py-3">
          {request.message}
        </p>
      )}

      {/* Time */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
        <Clock size={12} />
        {timeAgo(request.requestedAt)}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => handle("rejected")}
          disabled={!!loading}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl border border-red-100 bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition disabled:opacity-40"
        >
          {loading === "reject" ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={13} />}
          رفض
        </button>
        <button
          onClick={() => handle("approved")}
          disabled={!!loading}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-[#21166A] text-white text-xs font-bold hover:opacity-90 transition disabled:opacity-40"
        >
          {loading === "approve" ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle size={13} />}
          قبول
        </button>
      </div>
    </div>
  );
}

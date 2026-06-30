"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Inbox, User, AlertTriangle } from "lucide-react";
import { approveJoinRequest, rejectJoinRequest } from "../services/joinRequests.service";
import useJoinRequests   from "../hooks/useJoinRequests";
import { useLanguage }   from "@/features/i18n/context/LanguageContext";

type Props = {
  clubId: string;
  universityId: string;
  canManage?: boolean;
};

export default function JoinRequestsCard({ clubId, universityId, canManage = true }: Props) {
  const { requests, loading, error, loadRequests } = useJoinRequests(clubId, universityId);
  const [processingId, setProcessingId]            = useState<string | null>(null);
  const { t } = useLanguage();

  async function handleApprove(id: string) {
    setProcessingId(id);
    try {
      await approveJoinRequest(id);
      await loadRequests();
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(id: string) {
    setProcessingId(id);
    try {
      await rejectJoinRequest(id);
      await loadRequests();
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-400 text-center py-4">{t.president.loadingJoinReqs}</p>;
  }

  if (error) {
    return (
      <div className="flex items-start gap-3 rounded-2xl bg-red-50 border border-red-100 px-4 py-3">
        <AlertTriangle size={15} className="text-red-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-red-600">تعذّر جلب الطلبات</p>
          <p className="text-xs text-red-400 mt-0.5 font-mono">{error}</p>
          <p className="text-xs text-gray-500 mt-1">
            تحقق من أن clubId في ملفك الشخصي يطابق معرّف النادي في Firestore:
            <span className="font-mono bg-gray-100 px-1 rounded ml-1">{clubId}</span>
          </p>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
        <div className="w-12 h-12 rounded-[16px] bg-[#F3F0FA] flex items-center justify-center">
          <Inbox size={20} className="text-[#7C3AED]" />
        </div>
        <p className="text-sm font-bold text-gray-400">{t.president.noJoinReqs}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((req) => {
        const isProcessing = processingId === req.id;
        return (
          <div
            key={req.id}
            className="flex items-center gap-4 rounded-2xl border border-[#EEE7F8] bg-[#F8F6FC] p-4"
          >
            {/* Avatar */}
            <div className="shrink-0 w-10 h-10 rounded-[14px] bg-gradient-to-br from-[#7C3AED] to-[#22C55E] flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-[#21166A] truncate">
                {req.userName || t.president.newUser}
              </p>
              <p className="text-xs text-gray-400 truncate mt-0.5">
                {req.userEmail || "—"}
              </p>
            </div>

            {/* Actions */}
            {canManage && (
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleApprove(req.id)}
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:opacity-90 transition disabled:opacity-50"
                >
                  <CheckCircle size={13} />
                  {isProcessing ? "..." : t.approve}
                </button>
                <button
                  onClick={() => handleReject(req.id)}
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500 text-white text-xs font-bold hover:opacity-90 transition disabled:opacity-50"
                >
                  <XCircle size={13} />
                  {isProcessing ? "..." : t.reject}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

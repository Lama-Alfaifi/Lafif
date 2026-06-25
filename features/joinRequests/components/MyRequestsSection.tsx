"use client";

import { Clock, CheckCircle, XCircle, Inbox } from "lucide-react";
import useMyRequests from "../hooks/useMyRequests";
import type { JoinRequest, JoinRequestStatus } from "../types/joinRequest.types";

const STATUS_CONFIG: Record<
  JoinRequestStatus,
  { label: string; icon: React.ElementType; color: string; dot: string }
> = {
  pending: {
    label: "قيد المراجعة",
    icon: Clock,
    color: "bg-amber-100 text-amber-700",
    dot: "bg-amber-400",
  },
  approved: {
    label: "مقبول",
    icon: CheckCircle,
    color: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
  },
  rejected: {
    label: "مرفوض",
    icon: XCircle,
    color: "bg-red-100 text-red-600",
    dot: "bg-red-500",
  },
};

function timeAgo(ts?: { seconds: number } | null): string {
  if (!ts) return "";
  const diff = Math.floor(Date.now() / 1000 - ts.seconds);
  if (diff < 60) return "الآن";
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
  return `منذ ${Math.floor(diff / 86400)} يوم`;
}

function RequestCard({ req }: { req: JoinRequest }) {
  const cfg = STATUS_CONFIG[req.status];
  const Icon = cfg.icon;

  return (
    <div className="flex items-center gap-4 p-4 rounded-[20px] bg-[#F8F6FC] border border-[#EEE7F8]">
      {/* Club initial */}
      <div className="shrink-0 w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#7C3AED] to-[#22C55E] flex items-center justify-center text-white text-base font-black">
        {req.clubName?.[0] ?? "؟"}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-black text-[#21166A] truncate">{req.clubName}</p>
        <p className="text-xs text-gray-400 mt-0.5">{timeAgo(req.createdAt)}</p>
      </div>

      {/* Status badge */}
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold shrink-0 ${cfg.color}`}>
        <Icon size={12} />
        {cfg.label}
      </div>
    </div>
  );
}

export default function MyRequestsSection() {
  const { requests, loading } = useMyRequests();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-sm font-bold text-[#21166A]">جاري تحميل الطلبات...</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
        <div className="w-14 h-14 rounded-[20px] bg-[#F3F0FA] flex items-center justify-center">
          <Inbox size={24} className="text-[#7C3AED]" />
        </div>
        <div>
          <p className="text-sm font-black text-[#21166A]">لا توجد طلبات انضمام</p>
          <p className="text-xs text-gray-400 mt-1">
            تصفح الأندية وأرسل طلب انضمام لأي نادي
          </p>
        </div>
      </div>
    );
  }

  const pending = requests.filter((r) => r.status === "pending");
  const resolved = requests.filter((r) => r.status !== "pending");

  return (
    <div className="max-w-2xl space-y-5">

      {pending.length > 0 && (
        <div>
          <p className="text-xs font-bold text-gray-400 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            طلبات قيد المراجعة ({pending.length})
          </p>
          <div className="space-y-2.5">
            {pending.map((req) => <RequestCard key={req.id} req={req} />)}
          </div>
        </div>
      )}

      {resolved.length > 0 && (
        <div>
          <p className="text-xs font-bold text-gray-400 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
            الطلبات السابقة ({resolved.length})
          </p>
          <div className="space-y-2.5">
            {resolved.map((req) => <RequestCard key={req.id} req={req} />)}
          </div>
        </div>
      )}

    </div>
  );
}

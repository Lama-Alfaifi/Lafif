"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MessageSquare, Plus, X, Loader2, CheckCircle,
  AlertCircle, Clock, ChevronDown,
} from "lucide-react";

import Sidebar from "@/features/dashboard/components/Sidebar";
import { useAuth } from "@/features/auth/context/AuthContext";
import {
  submitTicket, getMyTickets, getAllTickets, updateTicket,
  type SupportTicket, type TicketStatus, type TicketCategory,
} from "../services/support.service";

/* ─── helpers ─── */
const CATEGORY_LABEL: Record<TicketCategory, string> = {
  technical: "مشكلة تقنية",
  account:   "مشكلة حساب",
  club:      "شؤون النادي",
  other:     "أخرى",
};

const STATUS_CONFIG: Record<TicketStatus, { label: string; style: string }> = {
  open:        { label: "مفتوحة",    style: "bg-blue-50 text-blue-600" },
  in_progress: { label: "قيد المعالجة", style: "bg-amber-50 text-amber-600" },
  resolved:    { label: "محلولة",    style: "bg-emerald-50 text-emerald-600" },
};

function timeAgo(ts: unknown): string {
  if (!ts || typeof ts !== "object") return "";
  const d = (ts as { toDate?: () => Date }).toDate?.();
  if (!d) return "";
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return "الآن";
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
  return `منذ ${Math.floor(diff / 86400)} يوم`;
}

/* ─── New Ticket Modal ─── */
function NewTicketModal({
  onClose,
  onSubmitted,
  userId,
  userName,
  userEmail,
  universityId,
  universityName,
}: {
  onClose: () => void;
  onSubmitted: () => void;
  userId: string;
  userName: string;
  userEmail: string;
  universityId: string;
  universityName: string;
}) {
  const [category, setCategory] = useState<TicketCategory>("technical");
  const [subject, setSubject]   = useState("");
  const [message, setMessage]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  async function handleSubmit() {
    if (!subject.trim() || !message.trim()) {
      setError("يرجى ملء جميع الحقول.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await submitTicket({ userId, userName, userEmail, universityId, universityName, category, subject: subject.trim(), message: message.trim(), adminReply: undefined });
      onSubmitted();
      onClose();
    } catch {
      setError("حدث خطأ، حاول مجدداً.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" dir="rtl">
      <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-md overflow-hidden">

        <div className="relative bg-[#21166A] px-6 py-5 flex items-center justify-between">
          <h2 className="text-base font-black text-white">تذكرة دعم جديدة</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition">
            <X size={15} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Category */}
          <div>
            <p className="text-xs font-bold text-gray-400 mb-2">التصنيف</p>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TicketCategory)}
                className="w-full appearance-none px-4 py-3 rounded-2xl border border-gray-100 bg-[#F7F5FF] text-sm font-bold text-[#21166A] outline-none"
              >
                {(Object.entries(CATEGORY_LABEL) as [TicketCategory, string][]).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Subject */}
          <div>
            <p className="text-xs font-bold text-gray-400 mb-2">الموضوع</p>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="وصف مختصر للمشكلة"
              className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-[#F7F5FF] text-sm font-bold text-[#21166A] placeholder:text-gray-300 outline-none focus:border-purple-200 transition"
            />
          </div>

          {/* Message */}
          <div>
            <p className="text-xs font-bold text-gray-400 mb-2">التفاصيل</p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="اشرح المشكلة بالتفصيل..."
              className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-[#F7F5FF] text-sm font-bold text-[#21166A] placeholder:text-gray-300 outline-none resize-none focus:border-purple-200 transition"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 text-red-500 text-xs font-bold">
              <AlertCircle size={13} />{error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-3 rounded-2xl border border-gray-100 text-sm font-bold text-gray-500 hover:bg-gray-50 transition">إلغاء</button>
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 py-3 rounded-2xl bg-[#21166A] text-white text-sm font-bold hover:opacity-90 transition disabled:opacity-40 flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={14} className="animate-spin" />جاري الإرسال</> : "إرسال"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Ticket row ─── */
function TicketRow({
  ticket,
  isAdmin,
  onUpdated,
  reviewerUserId,
}: {
  ticket: SupportTicket;
  isAdmin: boolean;
  onUpdated: () => void;
  reviewerUserId: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [reply, setReply]       = useState(ticket.adminReply ?? "");
  const [status, setStatus]     = useState<TicketStatus>(ticket.status);
  const [saving, setSaving]     = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await updateTicket(ticket.id, { status, adminReply: reply });
      onUpdated();
    } finally {
      setSaving(false);
    }
  }

  const sc = STATUS_CONFIG[ticket.status];

  return (
    <div className="bg-white rounded-[20px] border border-gray-50 shadow-md overflow-hidden">
      {/* Summary row */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-3 px-5 py-4 text-right hover:bg-[#FAFAFA] transition"
      >
        <div className="w-9 h-9 rounded-xl bg-[#EFE8F7] flex items-center justify-center shrink-0">
          <MessageSquare size={15} className="text-[#7C3AED]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-[#21166A] truncate">{ticket.subject}</p>
          <p className="text-xs text-gray-400 font-bold mt-0.5">
            {CATEGORY_LABEL[ticket.category]} · {timeAgo(ticket.createdAt)}
          </p>
        </div>
        <span className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full ${sc.style}`}>
          {sc.label}
        </span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-gray-50 px-5 py-4 space-y-4">
          {isAdmin && (
            <div className="bg-[#F7F5FF] rounded-2xl px-4 py-3">
              <p className="text-[10px] font-bold text-gray-400 mb-1">من: {ticket.userName} · {ticket.userEmail}</p>
              <p className="text-[10px] font-bold text-gray-400">{ticket.universityName}</p>
            </div>
          )}

          <div>
            <p className="text-xs font-bold text-gray-400 mb-1.5">الرسالة</p>
            <p className="text-sm text-gray-600 leading-6 bg-gray-50 rounded-2xl px-4 py-3">{ticket.message}</p>
          </div>

          {/* Admin reply (read-only for user) */}
          {!isAdmin && ticket.adminReply && (
            <div>
              <p className="text-xs font-bold text-[#7C3AED] mb-1.5">رد فريق الدعم</p>
              <div className="flex items-start gap-2 bg-[#EFE8F7] rounded-2xl px-4 py-3">
                <CheckCircle size={14} className="text-[#7C3AED] shrink-0 mt-0.5" />
                <p className="text-sm text-[#21166A] leading-6">{ticket.adminReply}</p>
              </div>
            </div>
          )}

          {/* Admin controls */}
          {isAdmin && (
            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold text-gray-400 mb-1.5">الرد</p>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={3}
                  placeholder="اكتب ردك هنا..."
                  className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-[#F7F5FF] text-sm font-bold text-[#21166A] placeholder:text-gray-300 outline-none resize-none focus:border-purple-200 transition"
                />
              </div>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TicketStatus)}
                    className="w-full appearance-none px-4 py-2.5 rounded-2xl border border-gray-100 bg-[#F7F5FF] text-xs font-bold text-[#21166A] outline-none"
                  >
                    <option value="open">مفتوحة</option>
                    <option value="in_progress">قيد المعالجة</option>
                    <option value="resolved">محلولة</option>
                  </select>
                  <ChevronDown size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-2xl bg-[#21166A] text-white text-xs font-bold hover:opacity-90 transition disabled:opacity-40 flex items-center gap-1.5"
                >
                  {saving ? <Loader2 size={12} className="animate-spin" /> : null}
                  حفظ
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Main page ─── */
export default function SupportPage() {
  const { user, profile } = useAuth();
  const [tickets, setTickets]     = useState<SupportTicket[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);

  const isAdmin = profile?.role === "superAdmin";

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = isAdmin
        ? await getAllTickets()
        : await getMyTickets(user.uid);
      setTickets(data);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, isAdmin]);

  useEffect(() => { load(); }, [load]);

  const open       = tickets.filter((t) => t.status === "open").length;
  const inProgress = tickets.filter((t) => t.status === "in_progress").length;
  const resolved   = tickets.filter((t) => t.status === "resolved").length;

  return (
    <div className="flex min-h-screen bg-[#F7F5FF]">
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Sticky header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
          <div className="px-8 py-4 flex items-center justify-between" dir="rtl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[14px] bg-[#EFE8F7] flex items-center justify-center shrink-0">
                <MessageSquare size={18} className="text-[#7C3AED]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#7C3AED] mb-0.5">
                  {isAdmin ? "Super Admin" : "المساعدة"}
                </p>
                <h1 className="text-xl font-black text-[#21166A]">
                  {isAdmin ? "تذاكر الدعم" : "الدعم والمساعدة"}
                </h1>
              </div>
            </div>

            {!isAdmin && (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#21166A] text-white text-sm font-bold hover:opacity-90 transition shadow"
              >
                <Plus size={15} />
                تذكرة جديدة
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-8" dir="rtl">
          <div className="max-w-2xl space-y-5">

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "مفتوحة",       val: open,       icon: <Clock size={14} className="text-blue-500" />,    style: "bg-blue-50" },
                { label: "قيد المعالجة", val: inProgress, icon: <AlertCircle size={14} className="text-amber-500" />, style: "bg-amber-50" },
                { label: "محلولة",       val: resolved,   icon: <CheckCircle size={14} className="text-emerald-500" />, style: "bg-emerald-50" },
              ].map(({ label, val, icon, style }) => (
                <div key={label} className="bg-white rounded-[20px] p-4 shadow-md border border-gray-50 text-center">
                  <div className={`w-8 h-8 rounded-xl ${style} flex items-center justify-center mx-auto mb-2`}>{icon}</div>
                  <p className="text-xl font-black text-[#21166A]">{val}</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Tickets list */}
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map((i) => (
                  <div key={i} className="h-16 rounded-[20px] bg-white shadow-md animate-pulse" />
                ))}
              </div>
            ) : tickets.length === 0 ? (
              <div className="bg-white rounded-[24px] p-10 shadow-md text-center">
                <MessageSquare size={28} className="text-gray-200 mx-auto mb-3" />
                <p className="text-sm font-bold text-gray-400">
                  {isAdmin ? "لا توجد تذاكر مرفوعة" : "لم ترفع أي تذكرة دعم بعد"}
                </p>
                {!isAdmin && (
                  <p className="text-xs text-gray-300 mt-1">
                    اضغط "تذكرة جديدة" إذا واجهت أي مشكلة
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map((t) => (
                  <TicketRow
                    key={t.id}
                    ticket={t}
                    isAdmin={isAdmin}
                    onUpdated={load}
                    reviewerUserId={user?.uid ?? ""}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Sidebar />

      {showModal && user && profile && (
        <NewTicketModal
          onClose={() => setShowModal(false)}
          onSubmitted={load}
          userId={user.uid}
          userName={profile.name ?? ""}
          userEmail={profile.email ?? user.email ?? ""}
          universityId={profile.universityId ?? ""}
          universityName={profile.universityName ?? ""}
        />
      )}
    </div>
  );
}

"use client";

import {
  approveJoinRequest,
  rejectJoinRequest,
} from "../services/joinRequests.service";

import useJoinRequests from "../hooks/useJoinRequests";

type JoinRequestsCardProps = {
  clubId: string;
  universityId: string;
};

export default function JoinRequestsCard({
  clubId,
  universityId,
}: JoinRequestsCardProps) {
  const { requests, loading, loadRequests } =
    useJoinRequests(clubId, universityId);

  async function handleApprove(id: string) {
    await approveJoinRequest(id);
    loadRequests();
  }

  async function handleReject(id: string) {
    await rejectJoinRequest(id);
    loadRequests();
  }

  if (loading) {
    return (
      <div className="bg-white rounded-[30px] p-5 shadow-lg">
        جاري تحميل الطلبات...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[30px] p-5 shadow-lg">
      <h2 className="text-xl font-black text-[#21166A] mb-5">
        طلبات الانضمام
      </h2>

      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request.id}
            className="
              rounded-2xl
              border border-[#EEE7F8]
              p-4
            "
          >
            <p className="font-bold text-[#21166A]">
              {request.userName || "مستخدم جديد"}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              {request.userEmail || "لا يوجد بريد"}
            </p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleApprove(request.id)}
                className="
                  px-4 py-2
                  rounded-xl
                  bg-emerald-500
                  text-white
                  text-sm
                  font-bold
                "
              >
                قبول
              </button>

              <button
                onClick={() => handleReject(request.id)}
                className="
                  px-4 py-2
                  rounded-xl
                  bg-red-500
                  text-white
                  text-sm
                  font-bold
                "
              >
                رفض
              </button>
            </div>
          </div>
        ))}

        {requests.length === 0 && (
          <p className="text-sm text-gray-500">
            لا توجد طلبات حالياً.
          </p>
        )}
      </div>
    </div>
  );
}
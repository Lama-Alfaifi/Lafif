"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { createClub } from "../services/createClub.service";

type CreateClubModalProps = {
  onClose: () => void;
  universityId: string;
  universityName: string;
  onCreated?: () => void;
};

export default function CreateClubModal({
  onClose,
  universityId,
  universityName,
  onCreated,
}: CreateClubModalProps) {
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [description, setDescription] = useState("");
  const [goals, setGoals] = useState("");
  const [achievements, setAchievements] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] =
    useState<"central" | "decentralized">("central");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleCreate() {
    setMessage("");

    if (!name || !college || !description) {
      setMessage("رجاءً عبئي اسم النادي والكلية والوصف.");
      return;
    }

    try {
      setLoading(true);

      await createClub({
        name,
        college,
        description,
        goals,
        achievements,
        president: "",
        email,
        image,
        category,
        universityId,
        universityName,
      });

      setMessage("تم إنشاء النادي بنجاح.");
      onCreated?.();

      setTimeout(() => {
        onClose();
      }, 700);
    } catch (error: any) {
      setMessage(error.message || "حدث خطأ أثناء إنشاء النادي.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm flex items-center justify-center p-5">
      <div
        className="w-full max-w-3xl rounded-[32px] bg-white shadow-2xl border border-white/80 p-6 relative"
        dir="rtl"
      >
        <button
          onClick={onClose}
          className="absolute top-5 left-5 w-10 h-10 rounded-2xl bg-[#F3F0FA] text-[#21166A] flex items-center justify-center hover:bg-[#E9E1F8] transition"
        >
          <X size={18} />
        </button>

        <div className="mb-6 text-right">
          <h2 className="text-2xl font-black text-[#21166A]">
            إضافة نادي جديد
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            سيتم ربط النادي تلقائيًا بـ {universityName}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="اسم النادي"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-2xl border border-[#EEE7F8] bg-[#F8F6FC] p-3 outline-none text-sm focus:border-[#7C3AED]"
          />

          <input
            placeholder="الكلية"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            className="rounded-2xl border border-[#EEE7F8] bg-[#F8F6FC] p-3 outline-none text-sm focus:border-[#7C3AED]"
          />

          <input
            placeholder="بريد النادي"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-2xl border border-[#EEE7F8] bg-[#F8F6FC] p-3 outline-none text-sm focus:border-[#7C3AED]"
          />

          <input
            placeholder="رابط صورة النادي"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="rounded-2xl border border-[#EEE7F8] bg-[#F8F6FC] p-3 outline-none text-sm focus:border-[#7C3AED]"
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as "central" | "decentralized")
            }
            className="rounded-2xl border border-[#EEE7F8] bg-[#F8F6FC] p-3 outline-none text-sm focus:border-[#7C3AED] md:col-span-2"
          >
            <option value="central">نادي مركزي</option>
            <option value="decentralized">نادي لامركزي</option>
          </select>
        </div>

        <textarea
          placeholder="نبذة عن النادي"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-4 w-full min-h-[90px] rounded-2xl border border-[#EEE7F8] bg-[#F8F6FC] p-4 outline-none text-sm focus:border-[#7C3AED]"
        />

        <textarea
          placeholder="أهداف النادي، كل هدف في سطر"
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          className="mt-4 w-full min-h-[90px] rounded-2xl border border-[#EEE7F8] bg-[#F8F6FC] p-4 outline-none text-sm focus:border-[#7C3AED]"
        />

        <textarea
          placeholder="أعمال وإنجازات النادي"
          value={achievements}
          onChange={(e) => setAchievements(e.target.value)}
          className="mt-4 w-full min-h-[90px] rounded-2xl border border-[#EEE7F8] bg-[#F8F6FC] p-4 outline-none text-sm focus:border-[#7C3AED]"
        />

        <button
          onClick={handleCreate}
          disabled={loading}
          className="mt-5 w-full rounded-2xl bg-[#21166A] text-white py-3 font-bold text-sm hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "جارٍ إنشاء النادي..." : "إنشاء النادي"}
        </button>

        {message && (
          <p className="mt-4 text-sm font-bold text-center text-[#21166A]">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
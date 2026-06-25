"use client";

import { useState } from "react";

import { X } from "lucide-react";

import { createEvent } from "../services/createEvent.service";

type CreateEventModalProps = {
  onClose: () => void;

  clubId: string;
  clubName: string;

  universityId: string;
  universityName: string;
};

export default function CreateEventModal({
  onClose,

  clubId,
  clubName,

  universityId,
  universityName,
}: CreateEventModalProps) {

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [place, setPlace] =
    useState("");

  const [time, setTime] =
    useState("");

  const [type, setType] =
    useState<"public" | "members">(
      "public"
    );

  const [day, setDay] =
    useState("");

  const [month, setMonth] =
    useState("");

  const [year, setYear] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleCreate() {

    setMessage("");

    if (
      !title ||
      !place ||
      !time ||
      !day ||
      !month ||
      !year
    ) {

      setMessage(
        "رجاءً عبئي الحقول الأساسية."
      );

      return;
    }

    try {

      setLoading(true);

      await createEvent({

        title,
        description,
        place,
        time,
        type,

        day: Number(day),
        month: Number(month),
        year: Number(year),

        clubId,
        clubName,

        universityId,
        universityName,

      });

      setMessage(
        "تم إنشاء الفعالية بنجاح."
      );

      setTitle("");
      setDescription("");
      setPlace("");
      setTime("");

      setDay("");
      setMonth("");
      setYear("");

      setTimeout(() => {

        onClose();

      }, 800);

    } catch (error: any) {

      setMessage(
        error.message ||
        "حدث خطأ أثناء إنشاء الفعالية."
      );

    } finally {

      setLoading(false);

    }

  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        bg-black/30
        backdrop-blur-sm
        flex
        items-center
        justify-center
        p-5
      "
    >

      <div
        className="
          w-full
          max-w-3xl
          rounded-[32px]
          bg-white
          shadow-2xl
          border
          border-white/80
          p-6
          relative
        "
        dir="rtl"
      >

        <button
          onClick={onClose}
          className="
            absolute
            top-5
            left-5
            w-10
            h-10
            rounded-2xl
            bg-[#F3F0FA]
            text-[#21166A]
            flex
            items-center
            justify-center
            hover:bg-[#E9E1F8]
            transition
          "
        >

          <X size={18} />

        </button>

        <div className="mb-6 text-right">

          <h2
            className="
              text-2xl
              font-black
              text-[#21166A]
            "
          >
            إنشاء فعالية جديدة
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            أضيفي ورشة أو فعالية تظهر مباشرة في تقويم الفعاليات.
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            placeholder="عنوان الفعالية"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            className="
              rounded-2xl
              border
              border-[#EEE7F8]
              bg-[#F8F6FC]
              p-3
              outline-none
              text-sm
              focus:border-[#7C3AED]
            "
          />

          <input
            placeholder="المكان"
            value={place}
            onChange={(e) =>
              setPlace(
                e.target.value
              )
            }
            className="
              rounded-2xl
              border
              border-[#EEE7F8]
              bg-[#F8F6FC]
              p-3
              outline-none
              text-sm
              focus:border-[#7C3AED]
            "
          />

          <input
            placeholder="الوقت مثال: 8:00 PM"
            value={time}
            onChange={(e) =>
              setTime(
                e.target.value
              )
            }
            className="
              rounded-2xl
              border
              border-[#EEE7F8]
              bg-[#F8F6FC]
              p-3
              outline-none
              text-sm
              focus:border-[#7C3AED]
            "
          />

          <select
            value={type}
            onChange={(e) =>
              setType(
                e.target.value as
                | "public"
                | "members"
              )
            }
            className="
              rounded-2xl
              border
              border-[#EEE7F8]
              bg-[#F8F6FC]
              p-3
              outline-none
              text-sm
              focus:border-[#7C3AED]
            "
          >

            <option value="public">
              فعالية عامة
            </option>

            <option value="members">
              للأعضاء فقط
            </option>

          </select>

          <input
            placeholder="اليوم"
            type="number"
            value={day}
            onChange={(e) =>
              setDay(
                e.target.value
              )
            }
            className="
              rounded-2xl
              border
              border-[#EEE7F8]
              bg-[#F8F6FC]
              p-3
              outline-none
              text-sm
              focus:border-[#7C3AED]
            "
          />

          <input
            placeholder="الشهر"
            type="number"
            value={month}
            onChange={(e) =>
              setMonth(
                e.target.value
              )
            }
            className="
              rounded-2xl
              border
              border-[#EEE7F8]
              bg-[#F8F6FC]
              p-3
              outline-none
              text-sm
              focus:border-[#7C3AED]
            "
          />

          <input
            placeholder="السنة"
            type="number"
            value={year}
            onChange={(e) =>
              setYear(
                e.target.value
              )
            }
            className="
              rounded-2xl
              border
              border-[#EEE7F8]
              bg-[#F8F6FC]
              p-3
              outline-none
              text-sm
              focus:border-[#7C3AED]
              md:col-span-2
            "
          />

        </div>

        <textarea
          placeholder="وصف الفعالية"
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
          className="
            mt-4
            w-full
            min-h-[120px]
            rounded-2xl
            border
            border-[#EEE7F8]
            bg-[#F8F6FC]
            p-4
            outline-none
            text-sm
            focus:border-[#7C3AED]
          "
        />

        <button
          onClick={handleCreate}
          disabled={loading}
          className="
            mt-5
            w-full
            rounded-2xl
            bg-[#21166A]
            text-white
            py-3
            font-bold
            text-sm
            hover:opacity-90
            transition
            disabled:opacity-60
          "
        >

          {loading
            ? "جارٍ إنشاء الفعالية..."
            : "إنشاء الفعالية"}

        </button>

        {message && (

          <p
            className="
              mt-4
              text-sm
              font-bold
              text-center
              text-[#21166A]
            "
          >
            {message}
          </p>

        )}

      </div>

    </div>
  );
}
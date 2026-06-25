"use client";

import useClubAnalytics
from "../hooks/useClubAnalytics";

export default function
AIInsightsCard() {

  const {

    analytics,

    loading,

  } = useClubAnalytics();

  if (
    loading ||
    !analytics
  ) {

    return (

      <div
        className="
          bg-white
          rounded-[32px]
          p-7
          shadow-xl
        "
      >
        جاري تحميل تحليلات AI...
      </div>

    );

  }

  return (

    <div
      className="
        bg-white
        rounded-[32px]
        p-7
        shadow-xl
      "
    >

      {/* Header */}
      <div
        className="
          flex items-center
          justify-between
        "
      >

        <div>

          <p
            className="
              text-sm
              text-emerald-600
              font-bold
            "
          >
            AI Analytics
          </p>

          <h1
            className="
              text-2xl
              font-black
              mt-2
              text-[#0F172A]
            "
          >
            تحليل أداء النادي
          </h1>

        </div>

        {/* Score */}
        <div
          className="
            w-20 h-20
            rounded-full
            bg-gradient-to-br
            from-cyan-500
            to-emerald-500
            text-white
            flex items-center
            justify-center
            text-2xl
            font-black
            shadow-lg
          "
        >
          {analytics.score}
        </div>

      </div>

      {/* Status */}
      <div
        className="
          mt-8
          bg-gray-50
          rounded-2xl
          p-5
        "
      >

        <p
          className="
            text-gray-400
            text-sm
          "
        >
          حالة النادي
        </p>

        <h1
          className="
            text-2xl
            font-black
            mt-2
            text-[#0F172A]
          "
        >
          {analytics.insight.status}
        </h1>

      </div>

      {/* Recommendation */}
      <div
        className="
          mt-5
          bg-cyan-50
          rounded-2xl
          p-5
          border border-cyan-100
        "
      >

        <p
          className="
            text-cyan-700
            text-sm
            font-bold
          "
        >
          توصية AI
        </p>

        <p
          className="
            mt-3
            text-[#0F172A]
            leading-8
          "
        >
          {analytics.insight.recommendation}
        </p>

      </div>

      {/* Stats */}
      <div
        className="
          grid grid-cols-3
          gap-4
          mt-6
        "
      >

        <div
          className="
            bg-gray-50
            rounded-2xl
            p-4
            text-center
          "
        >

          <h1
            className="
              text-2xl
              font-black
              text-[#0F172A]
            "
          >
            {analytics.engagement}%
          </h1>

          <p
            className="
              text-xs
              text-gray-500
              mt-1
            "
          >
            التفاعل
          </p>

        </div>

        <div
          className="
            bg-gray-50
            rounded-2xl
            p-4
            text-center
          "
        >

          <h1
            className="
              text-2xl
              font-black
              text-[#0F172A]
            "
          >
            {analytics.attendance}%
          </h1>

          <p
            className="
              text-xs
              text-gray-500
              mt-1
            "
          >
            الحضور
          </p>

        </div>

        <div
          className="
            bg-gray-50
            rounded-2xl
            p-4
            text-center
          "
        >

          <h1
            className="
              text-2xl
              font-black
              text-[#0F172A]
            "
          >
            {analytics.challengeCompletion}%
          </h1>

          <p
            className="
              text-xs
              text-gray-500
              mt-1
            "
          >
            إنجاز التحديات
          </p>

        </div>

      </div>

      {/* Bottom */}
      <div
        className="
          flex items-center
          justify-between
          mt-8
        "
      >

        <div
          className="
            flex items-center
            gap-2
          "
        >

          <div
            className="
              w-3 h-3
              rounded-full
              bg-emerald-500
            "
          />

          <p
            className="
              text-sm
              text-gray-500
            "
          >
            التحليل محدث تلقائيًا بواسطة AI
          </p>

        </div>

        <button
          className="
            px-5 py-3
            rounded-2xl
            bg-[#0F172A]
            text-white
            hover:scale-105
            active:scale-95
            transition-all duration-300
          "
        >
          عرض التفاصيل
        </button>

      </div>

    </div>

  );

}
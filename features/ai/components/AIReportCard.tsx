"use client";

import analysisService
from "../services/analysis.service";

import recommendationService
from "../services/recommendation.service";

export default function
AIReportCard() {

  const analytics =
    analysisService();

  const recommendation =
    recommendationService(

      analytics.score,

      analytics.engagement,

    );

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
      <div>

        <p
          className="
            text-sm
            text-cyan-600
            font-bold
          "
        >
          AI Smart Report
        </p>

        <h1
          className="
            text-2xl
            font-black
            mt-2
            text-[#0F172A]
          "
        >
          التقرير الذكي للنادي
        </h1>

      </div>

      {/* Main Report */}
      <div
        className="
          mt-8
          bg-gray-50
          rounded-3xl
          p-6
          leading-9
        "
      >

        <p className="text-[#0F172A]">

          حقق النادي هذا الأسبوع
          مستوى أداء بلغ

          <span
            className="
              font-black
              text-cyan-600
            "
          >
            {" "}
            {analytics.score}%
          </span>

          ، مع معدل تفاعل مرتفع
          من الأعضاء داخل الفعاليات.

          ويقترح AI التركيز على:

          <span
            className="
              font-black
              text-emerald-600
            "
          >
            {" "}
            {recommendation.workshop}
          </span>

          ، لتحسين الانتشار
          وزيادة عدد المشاركين.

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

    </div>

  );

}
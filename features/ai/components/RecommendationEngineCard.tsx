"use client";

import analysisService
from "../services/analysis.service";

import recommendationService
from "../services/recommendation.service";

export default function
RecommendationEngineCard() {

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
            AI Recommendation Engine
          </p>

          <h1
            className="
              text-2xl
              font-black
              mt-2
              text-[#0F172A]
            "
          >
            توصيات تطوير النادي
          </h1>

        </div>

        <div
          className="
            px-4 py-2
            rounded-full
            bg-emerald-100
            text-emerald-700
            text-sm
            font-bold
          "
        >
          {recommendation.priority}
        </div>

      </div>

      {/* Recommendation */}
      <div
        className="
          mt-8
          bg-gray-50
          rounded-3xl
          p-6
        "
      >

        <p
          className="
            text-sm
            text-gray-400
          "
        >
          توصية AI
        </p>

        <h1
          className="
            mt-3
            text-xl
            font-black
            leading-10
            text-[#0F172A]
          "
        >
          {recommendation.recommendation}
        </h1>

      </div>

      {/* Stats */}
      <div
        className="
          grid grid-cols-2
          gap-4
          mt-6
        "
      >

        <div
          className="
            bg-gray-50
            rounded-2xl
            p-5
          "
        >

          <p
            className="
              text-sm
              text-gray-400
            "
          >
            مستوى النادي
          </p>

          <h1
            className="
              mt-2
              text-2xl
              font-black
            "
          >
            {recommendation.level}
          </h1>

        </div>

        <div
          className="
            bg-gray-50
            rounded-2xl
            p-5
          "
        >

          <p
            className="
              text-sm
              text-gray-400
            "
          >
            الورشة المقترحة
          </p>

          <h1
            className="
              mt-2
              text-xl
              font-black
            "
          >
            {recommendation.workshop}
          </h1>

        </div>

      </div>

    </div>

  );

}
"use client";

import predictionService
from "../services/prediction.service";

export default function
RecommendationCard() {

  const data =
    predictionService();

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
            text-purple-500
            font-bold
          "
        >
          AI Prediction
        </p>

        <h1
          className="
            text-2xl
            font-black
            mt-2
            text-[#0F172A]
          "
        >
          توقعات الفعالية القادمة
        </h1>

      </div>

      {/* Stats */}
      <div
        className="
          grid grid-cols-2
          gap-4
          mt-8
        "
      >

        {/* Attendance */}
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
            الحضور المتوقع
          </p>

          <h1
            className="
              text-3xl
              font-black
              mt-2
              text-[#0F172A]
            "
          >
            {data.predictedAttendance}
          </h1>

        </div>

        {/* Success */}
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
            نسبة النجاح
          </p>

          <h1
            className="
              text-3xl
              font-black
              mt-2
              text-emerald-500
            "
          >
            %{data.successRate}
          </h1>

        </div>

      </div>

      {/* Recommendation */}
      <div
        className="
          mt-6
          bg-purple-50
          border border-purple-100
          rounded-2xl
          p-5
        "
      >

        <p
          className="
            text-sm
            text-purple-600
            font-bold
          "
        >
          توصية AI
        </p>

        <p
          className="
            mt-3
            leading-8
            text-[#0F172A]
          "
        >
          يتوقع النظام تفاعلًا مرتفعًا،
          وننصح بإضافة جوائز
          لزيادة المشاركة.
        </p>

      </div>

    </div>

  );

}
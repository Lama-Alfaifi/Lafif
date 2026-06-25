export default function
generateInsights(score: number) {

  if (score >= 90) {

    return {

      status:
      "ممتاز",

      recommendation:
      "استمر بنفس جودة الفعاليات الحالية",

    };

  }

  if (score >= 75) {

    return {

      status:
      "جيد",

      recommendation:
      "ننصح بزيادة التفاعل الجماعي",

    };

  }

  return {

    status:
    "ضعيف",

    recommendation:
    "ننصح بإقامة ورش وأنشطة تفاعلية",

  };

}
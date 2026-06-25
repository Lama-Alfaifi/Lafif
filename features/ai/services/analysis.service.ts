export default function
analysisService() {

  const attendance =
    Math.floor(
      Math.random() * 100
    ) + 50;

  const engagement =
    Math.floor(
      Math.random() * 100
    );

  const completion =
    Math.floor(
      Math.random() * 100
    );

  const score =
    Math.floor(

      (
        attendance +
        engagement +
        completion
      ) / 3

    );

  let status =
    "ممتاز";

  let recommendation =
    "استمر بنفس مستوى الأداء.";

  if (score < 90) {

    status =
      "جيد جدًا";

    recommendation =
      "زيادة التفاعل عبر الجوائز والتحديات.";

  }

  if (score < 75) {

    status =
      "جيد";

    recommendation =
      "تحسين التسويق للفعاليات القادمة.";

  }

  if (score < 60) {

    status =
      "يحتاج تحسين";

    recommendation =
      "إضافة أنشطة تفاعلية وورش عمل.";

  }

  return {

    score,

    attendance,

    engagement,

    challengeCompletion:
    completion,

    insight: {

      status,

      recommendation,

    },

  };

}
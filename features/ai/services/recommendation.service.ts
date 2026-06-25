export default function
recommendationService(

  score: number,

  engagement: number,

) {

  // ممتاز
  if (
    score >= 90 &&
    engagement >= 80
  ) {

    return {

      level:
      "مرتفع",

      recommendation:
      "نوصي بإقامة هاكاثون أو فعالية تنافسية كبيرة لزيادة الانتشار.",

      workshop:
      "Advanced Workshop",

      priority:
      "High",

    };

  }

  // جيد
  if (
    score >= 70
  ) {

    return {

      level:
      "متوسط",

      recommendation:
      "يفضل إضافة جوائز وتحسين التفاعل داخل الفعاليات القادمة.",

      workshop:
      "Interactive Workshop",

      priority:
      "Medium",

    };

  }

  // منخفض
  return {

    level:
    "منخفض",

    recommendation:
    "النادي يحتاج فعاليات تفاعلية قصيرة مع حملات تسويق قوية.",

    workshop:
    "Beginner Workshop",

    priority:
    "Critical",

  };

}
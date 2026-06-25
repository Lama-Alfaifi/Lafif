export const arabicMonths = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

export const arabicDays = [
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

export function getDaysInMonth(
  year: number,
  month: number
) {
  return new Date(year, month, 0).getDate();
}

export function getFirstDayOfMonth(
  year: number,
  month: number
) {
  return new Date(year, month - 1, 1).getDay();
}

export function getCalendarCells(
  year: number,
  month: number
) {
  const daysInMonth =
    getDaysInMonth(year, month);

  const firstDay =
    getFirstDayOfMonth(year, month);

  const emptyDays =
    Array.from({ length: firstDay }, () => null);

  const monthDays =
    Array.from(
      { length: daysInMonth },
      (_, i) => i + 1
    );

  return [...emptyDays, ...monthDays];
}
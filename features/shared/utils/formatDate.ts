export default function formatDate(
  date: Date
) {

  return new Intl.DateTimeFormat(
    "ar-SA",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  ).format(date);

}
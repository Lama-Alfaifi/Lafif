export function classNames(
  ...classes: string[]
) {

  return classes
    .filter(Boolean)
    .join(" ");

}

export function truncateText(
  text: string,
  length: number
) {

  if (text.length <= length) {
    return text;
  }

  return text.slice(0, length) + "...";

}

export function formatNumber(
  number: number
) {

  return new Intl.NumberFormat(
    "ar-SA"
  ).format(number);

}
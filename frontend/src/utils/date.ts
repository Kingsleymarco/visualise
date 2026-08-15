export const todayDate = new Date();
todayDate.setHours(0, 0, 0, 0);

export function toISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getMonthStart(): Date {
  const date = new Date(todayDate);
  date.setDate(1);
  return date;
}

export function getDaysInCurrentMonth(): number {
  return new Date(
    todayDate.getFullYear(),
    todayDate.getMonth() + 1,
    0,
  ).getDate();
}

export function currentMonthName(): string {
  return todayDate.toLocaleDateString("en-US", { month: "long" });
}

export function ordinal(value: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const remainder = value % 100;
  return (
    value +
    (suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0])
  );
}

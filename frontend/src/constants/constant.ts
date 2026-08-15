import type { Recurrence } from "@/models/financial";

export const GREEN_PALETTE = [
  "#1B5E20",
  "#388E3C",
  "#66BB6A",
  "#A5D6A7",
  "#C8E6C9",
];

export const WARM_PALETTE = [
  "#E65100",
  "#F57C00",
  "#F9A825",
  "#EF5350",
  "#E53935",
  "#EC407A",
];

export const RECURRENCE_OPTIONS: Recurrence[] = [
  "Once",
  "Daily",
  "Weekly",
  "Monthly",
  "Yearly",
  "Custom",
];

export function getCurrentMonth(): string {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

import type { Income, IncomeFormData } from "@/models/financial";
import { toISO, todayDate } from "@/utils/date";

export const createIncomeForm = (): IncomeFormData => ({
  label: "",
  amount: "",
  recurrence: "Monthly",
  recurrence_interval: "",
  start_date: toISO(todayDate),
});

export function incomeToForm(income: Income): IncomeFormData {
  return {
    label: income.label,
    amount: String(income.amount),
    recurrence: income.recurrence ?? "Monthly",
    recurrence_interval:
      income.recurrence_interval !== null
        ? String(income.recurrence_interval)
        : "",
    start_date: income.start_date,
  };
}

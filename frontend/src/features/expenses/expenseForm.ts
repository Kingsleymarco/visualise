import type { Expense, ExpenseFormData } from "@/models/financial";
import { toISO, todayDate } from "@/utils/date";

export const createExpenseForm = (): ExpenseFormData => ({
  label: "",
  amount: "",
  recurrence: "Monthly",
  recurrence_interval: "",
  category_id: 0,
  start_date: toISO(todayDate),
});

export function expenseToForm(expense: Expense): ExpenseFormData {
  return {
    label: expense.label,
    amount: String(expense.amount),
    recurrence: expense.recurrence ?? "Monthly",
    recurrence_interval:
      expense.recurrence_interval !== null
        ? String(expense.recurrence_interval)
        : "",
    category_id: expense.category_id,
    start_date: expense.start_date,
  };
}

export type Recurrence =
  | "Once"
  | "Daily"
  | "Weekly"
  | "Monthly"
  | "Yearly"
  | "Custom";

export interface Category {
  category_id: number;
  category_name: string;
  is_necessity: boolean;
}

export interface Income {
  income_id: number;
  user_id: number;
  label: string;
  amount: number;
  recurrence: Recurrence | null;
  recurrence_interval: number | null;
  start_date: string;
}

export interface Expense {
  expense_id: number;
  user_id: number;
  category_id: number;
  label: string;
  amount: number;
  recurrence: Recurrence | null;
  recurrence_interval: number | null;
  start_date: string;
}

export interface IncomeCreate {
  label: string;
  amount: number;
  recurrence?: Recurrence | null;
  recurrence_interval?: number | null;
  start_date: string;
}

export interface ExpenseCreate {
  category_id: number;
  label: string;
  amount: number;
  recurrence?: Recurrence | null;
  recurrence_interval?: number | null;
  start_date: string;
}

export interface IncomeFormData {
  label: string;
  amount: string;
  recurrence: Recurrence;
  recurrence_interval: string;
  start_date: string;
}

export interface ExpenseFormData {
  label: string;
  amount: string;
  recurrence: Recurrence;
  recurrence_interval: string;
  category_id: number;
  start_date: string;
}

export interface BalanceHistoryEntry {
  date: string;
  balance: number;
}

export interface RemainingEvent {
  date: string;
  name: string;
  amount: number;
  kind: "income" | "expense";
}

export interface ForecastResponse {
  balance_history: BalanceHistoryEntry[];

  lowest_balance_day: {
    date: string;
    balance: number;
  } | null;

  remaining_events: RemainingEvent[];

  monthly_income: number;
  monthly_expense: number;
  net_monthly: number;
}

export interface DonutSlice {
  name: string;
  value: number;
}

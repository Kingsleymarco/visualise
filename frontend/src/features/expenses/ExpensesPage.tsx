import { useEffect, useState } from "react";
import { DonutChart } from "@/components/charts/DonutChart";
import { ExpenseForm } from "@/components/forms/ExpenseForm";
import { WARM_PALETTE } from "@/constants/constant";
import type {
  Category,
  DonutSlice,
  Expense,
  ExpenseCreate,
  ExpenseFormData,
  ForecastResponse,
} from "@/models/financial";
import { getCurrentMonth } from "@/constants/constant";
import { formatCurrency } from "@/utils/format";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { cardStyle } from "@/styles/theme";
import { ExpenseRow } from "@/features/expenses/components/ExpenseRow";
import { FinancialService } from "@/services/financial.service";
import {
  createExpenseForm,
  expenseToForm,
} from "@/features/expenses/expenseForm";

const USER_ID = 1;

export function ExpensesPage({
  expenses,
  onChange,
}: {
  expenses: Expense[];
  onChange: (v: Expense[]) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [monthlyLoading, setMonthlyLoading] = useState(true);

  const [monthlyExpense, setMonthlyExpense] = useState<number>(0);

  const [forecast, setForecast] = useState<ForecastResponse | null>(null);

  const [error, setError] = useState<string | null>(null);

  const isMobile = useWindowWidth() < 640;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        setError(null);

        const data = await FinancialService.getCategories();

        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
        setError("Failed to load expense categories.");
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadMonthlyExpense = async () => {
      try {
        setMonthlyLoading(true);

        const month = getCurrentMonth();

        const data = await FinancialService.getForecast(USER_ID, month);

        setForecast(data);
        setMonthlyExpense(data.monthly_expense);
      } catch (err) {
        console.error("Failed to load monthly expense:", err);

        setError("Failed to load monthly expense summary.");
      } finally {
        setMonthlyLoading(false);
      }
    };

    loadMonthlyExpense();
  }, [expenses]);

  const handleAdd = async (form: ExpenseFormData) => {
    try {
      setLoading(true);
      setError(null);

      const expense: ExpenseCreate = {
        category_id: form.category_id,
        label: form.label.trim(),
        amount: parseFloat(form.amount),
        recurrence: form.recurrence,
        recurrence_interval:
          form.recurrence === "Custom"
            ? parseInt(form.recurrence_interval) || null
            : null,
        start_date: form.start_date,
      };

      const newExpense = await FinancialService.createExpense(USER_ID, expense);

      onChange([...expenses, newExpense]);
      setShowAdd(false);
    } catch (err) {
      console.error("Failed to create expense:", err);

      setError("Failed to add expense.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (expenseId: number, form: ExpenseFormData) => {
    try {
      setLoading(true);
      setError(null);

      const expense: ExpenseCreate = {
        category_id: form.category_id,
        label: form.label.trim(),
        amount: parseFloat(form.amount),
        recurrence: form.recurrence,
        recurrence_interval:
          form.recurrence === "Custom"
            ? parseInt(form.recurrence_interval) || null
            : null,
        start_date: form.start_date,
      };

      const updatedExpense = await FinancialService.updateExpense(
        expenseId,
        expense,
      );

      onChange(
        expenses.map((item) =>
          item.expense_id === expenseId ? updatedExpense : item,
        ),
      );

      setEditId(null);
    } catch (err) {
      console.error("Failed to update expense:", err);

      setError("Failed to update expense.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (expenseId: number) => {
    try {
      setLoading(true);
      setError(null);

      await FinancialService.deleteExpense(expenseId);

      onChange(expenses.filter((expense) => expense.expense_id !== expenseId));
    } catch (err) {
      console.error("Failed to delete expense:", err);

      setError("Failed to delete expense.");
    } finally {
      setLoading(false);
    }
  };
  const categoryTotals: Record<string, number> = {};

  if (forecast) {
    for (const event of forecast.remaining_events) {
      if (event.kind !== "expense") {
        continue;
      }

      const matchingExpense = expenses.find(
        (expense) => expense.label === event.name,
      );

      const category = categories.find(
        (item) => item.category_id === matchingExpense?.category_id,
      );

      const categoryName = category?.category_name ?? "Unknown";

      categoryTotals[categoryName] =
        (categoryTotals[categoryName] ?? 0) + Number(event.amount);
    }
  }

  const donutData: DonutSlice[] = Object.entries(categoryTotals)
    .map(([name, value]) => ({
      name,
      value: Math.round(value * 100) / 100,
    }))
    .filter((data) => data.value > 0)
    .sort((a, b) => b.value - a.value);

  return (
    <div
      style={{
        padding: isMobile ? "20px 16px" : "28px 32px",
        maxWidth: 980,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
          marginBottom: 24,
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 12,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#4a6280",
              marginBottom: 6,
            }}
          >
            Expenses
          </div>

          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: isMobile ? 22 : 28,
              fontWeight: 500,
              color: "#EF5350",
            }}
          >
            {monthlyLoading ? "..." : formatCurrency(monthlyExpense)}
          </div>
        </div>

        {!showAdd && (
          <button
            onClick={() => setShowAdd(true)}
            style={{
              background: "transparent",
              color: "#c4d4ea",
              border: "1px solid #1c2e48",
              borderRadius: 5,
              padding: "9px 18px",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            + Add Expense
          </button>
        )}
      </div>

      {error && (
        <div
          style={{
            color: "#ef5350",
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "340px 1fr",
          gap: 20,
          alignItems: "start",
        }}
      >
        <div
          style={{
            ...cardStyle,
            padding: "22px 24px",
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#4a6280",
              marginBottom: 16,
            }}
          >
            Spending by Category
          </div>

          <DonutChart
            data={donutData}
            palette={WARM_PALETTE}
            centerLabel="TOTAL"
            centerValue={
              monthlyLoading ? "..." : formatCurrency(monthlyExpense)
            }
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {showAdd && (
            <ExpenseForm
              categories={categories}
              initial={createExpenseForm()}
              onSave={handleAdd}
              onCancel={() => setShowAdd(false)}
              saveLabel="Add Expense"
            />
          )}

          {categoriesLoading && (
            <div
              style={{
                color: "#4a6280",
                fontSize: 12,
                textAlign: "center",
                padding: 8,
              }}
            >
              Loading categories...
            </div>
          )}

          {expenses.length === 0 && !showAdd && !categoriesLoading && (
            <div
              style={{
                color: "#3a5570",
                fontSize: 13,
                padding: "32px 0",
                textAlign: "center",
              }}
            >
              No expenses added yet. Add one above.
            </div>
          )}

          {expenses.map((expense) =>
            editId === expense.expense_id ? (
              <ExpenseForm
                key={expense.expense_id}
                categories={categories}
                initial={expenseToForm(expense)}
                onSave={(form) => handleEdit(expense.expense_id, form)}
                onCancel={() => setEditId(null)}
                saveLabel="Save Changes"
              />
            ) : (
              <ExpenseRow
                key={expense.expense_id}
                expense={expense}
                onEdit={() => setEditId(expense.expense_id)}
                onRemove={() => handleRemove(expense.expense_id)}
              />
            ),
          )}

          {loading && (
            <div
              style={{
                color: "#4a6280",
                fontSize: 12,
                textAlign: "center",
                padding: 8,
              }}
            >
              Saving...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { AppNavigation } from "@/components/layout/AppNavigation";
import { ExpensesPage } from "@/features/expenses/ExpensesPage";
import { ForecastPage } from "@/features/forecast/ForecastPage";
import { IncomePage } from "@/features/income/IncomePage";
import { FinancialService } from "@/services/financial.service";
import type { Expense, Income } from "@/models/financial";
import type { Page } from "@/models/navigation";

export default function App() {
  const USER_ID = 1;

  const [page, setPage] = useState<Page>("forecast");

  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFinancialData() {
      try {
        setLoading(true);
        setError(null);

        const [incomeData, expenseData] = await Promise.all([
          FinancialService.getIncomes(USER_ID),
          FinancialService.getExpenses(USER_ID),
        ]);

        setIncomes(incomeData);
        setExpenses(expenseData);
      } catch (err) {
        console.error("Failed to load financial data:", err);
        setError("Failed to load your financial data.");
      } finally {
        setLoading(false);
      }
    }

    loadFinancialData();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#070c1a",
          color: "#c4d4ea",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Mono', monospace",
        }}
      >
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#070c1a",
          color: "#c4d4ea",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Mono', monospace",
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#070c1a",
        color: "#c4d4ea",
      }}
    >
      <AppNavigation currentPage={page} onPageChange={setPage} />

      {page === "forecast" && (
        <ForecastPage incomes={incomes} expenses={expenses} />
      )}

      {page === "income" && (
        <IncomePage incomes={incomes} onChange={setIncomes} />
      )}

      {page === "expenses" && (
        <ExpensesPage expenses={expenses} onChange={setExpenses} />
      )}
    </div>
  );
}

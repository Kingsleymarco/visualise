import { useEffect, useState } from "react";
import { DonutChart } from "@/components/charts/DonutChart";
import { IncomeForm } from "@/components/forms/IncomeForm";
import { GREEN_PALETTE } from "@/constants/constant";
import type {
  DonutSlice,
  Income,
  IncomeCreate,
  IncomeFormData,
  ForecastResponse,
} from "@/models/financial";
import { getCurrentMonth } from "@/constants/constant";
import { formatCurrency } from "@/utils/format";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { cardStyle } from "@/styles/theme";
import { IncomeRow } from "@/features/income/components/IncomeRow";
import { FinancialService } from "@/services/financial.service";
import { createIncomeForm, incomeToForm } from "@/features/income/incomeForm";

const USER_ID = 1;

export function IncomePage({
  incomes,
  onChange,
}: {
  incomes: Income[];
  onChange: (v: Income[]) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  const [monthlyLoading, setMonthlyLoading] = useState(true);

  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);

  const [forecast, setForecast] = useState<ForecastResponse | null>(null);

  const [error, setError] = useState<string | null>(null);

  const isMobile = useWindowWidth() < 640;

  useEffect(() => {
    const loadMonthlyIncome = async () => {
      try {
        setMonthlyLoading(true);

        const month = getCurrentMonth();

        const data = await FinancialService.getForecast(USER_ID, month);

        setForecast(data);
        setMonthlyIncome(data.monthly_income);
      } catch (err) {
        console.error("Failed to load monthly income:", err);

        setError("Failed to load monthly income summary.");
      } finally {
        setMonthlyLoading(false);
      }
    };

    loadMonthlyIncome();
  }, [incomes]);

  const handleAdd = async (form: IncomeFormData) => {
    try {
      setLoading(true);
      setError(null);

      const income: IncomeCreate = {
        label: form.label.trim(),
        amount: parseFloat(form.amount),
        recurrence: form.recurrence,
        recurrence_interval:
          form.recurrence === "Custom"
            ? parseInt(form.recurrence_interval) || null
            : null,
        start_date: form.start_date,
      };

      const newIncome = await FinancialService.createIncome(USER_ID, income);

      onChange([...incomes, newIncome]);
      setShowAdd(false);
    } catch (err) {
      console.error("Failed to create income:", err);

      setError("Failed to add income.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (incomeId: number, form: IncomeFormData) => {
    try {
      setLoading(true);
      setError(null);

      const income: IncomeCreate = {
        label: form.label.trim(),
        amount: parseFloat(form.amount),
        recurrence: form.recurrence,
        recurrence_interval:
          form.recurrence === "Custom"
            ? parseInt(form.recurrence_interval) || null
            : null,
        start_date: form.start_date,
      };

      const updatedIncome = await FinancialService.updateIncome(
        incomeId,
        income,
      );

      onChange(
        incomes.map((item) =>
          item.income_id === incomeId ? updatedIncome : item,
        ),
      );

      setEditId(null);
    } catch (err) {
      console.error("Failed to update income:", err);

      setError("Failed to update income.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (incomeId: number) => {
    try {
      setLoading(true);
      setError(null);

      await FinancialService.deleteIncome(incomeId);

      onChange(incomes.filter((income) => income.income_id !== incomeId));
    } catch (err) {
      console.error("Failed to delete income:", err);

      setError("Failed to delete income.");
    } finally {
      setLoading(false);
    }
  };

  const incomeTotals: Record<string, number> = {};

  if (forecast) {
    for (const event of forecast.remaining_events) {
      if (event.kind !== "income") {
        continue;
      }

      incomeTotals[event.name] =
        (incomeTotals[event.name] ?? 0) + Number(event.amount);
    }
  }

  const donutData: DonutSlice[] = Object.entries(incomeTotals)
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
            Income Sources
          </div>

          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: isMobile ? 22 : 28,
              fontWeight: 500,
              color: "#66BB6A",
            }}
          >
            {monthlyLoading ? "..." : formatCurrency(monthlyIncome)}

            <span
              style={{
                color: "#3a5570",
                fontSize: 14,
                fontWeight: 400,
              }}
            >
              {" "}
              / mo
            </span>
          </div>
        </div>

        {!showAdd && (
          <button
            onClick={() => setShowAdd(true)}
            style={{
              background: "#1B5E20",
              color: "#C8E6C9",
              border: "none",
              borderRadius: 5,
              padding: "9px 18px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            + Add Source
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
            Monthly Breakdown
          </div>

          <DonutChart
            data={donutData}
            palette={GREEN_PALETTE}
            centerLabel="TOTAL"
            centerValue={monthlyLoading ? "..." : formatCurrency(monthlyIncome)}
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
            <IncomeForm
              initial={createIncomeForm()}
              onSave={handleAdd}
              onCancel={() => setShowAdd(false)}
              saveLabel="Add Income Source"
            />
          )}

          {incomes.length === 0 && !showAdd && (
            <div
              style={{
                color: "#3a5570",
                fontSize: 13,
                padding: "32px 0",
                textAlign: "center",
              }}
            >
              No income sources yet. Add one to get started.
            </div>
          )}

          {incomes.map((income) =>
            editId === income.income_id ? (
              <IncomeForm
                key={income.income_id}
                initial={incomeToForm(income)}
                onSave={(form) => handleEdit(income.income_id, form)}
                onCancel={() => setEditId(null)}
                saveLabel="Save Changes"
              />
            ) : (
              <IncomeRow
                key={income.income_id}
                income={income}
                onEdit={() => setEditId(income.income_id)}
                onRemove={() => handleRemove(income.income_id)}
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

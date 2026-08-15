import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltip } from "@/components/charts/ChartTooltip";
import type {
  BalanceHistoryEntry,
  Expense,
  Income,
  ForecastResponse,
} from "@/models/financial";
import { FinancialService } from "@/services/financial.service";
import { formatCurrency, formatCurrencyFull } from "@/utils/format";
import { currentMonthName } from "@/utils/date";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { cardStyle } from "@/styles/theme";

const USER_ID = 1;

export function ForecastPage({
  incomes,
  expenses,
}: {
  incomes: Income[];
  expenses: Expense[];
}) {
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isMobile = useWindowWidth() < 640;

  useEffect(() => {
    const loadForecast = async () => {
      try {
        setLoading(true);
        setError(null);
        const now = new Date();
        const month = `${now.getFullYear()}-${String(
          now.getMonth() + 1,
        ).padStart(2, "0")}`;

        const data = await FinancialService.getForecast(USER_ID, month);

        setForecast(data);
      } catch (err) {
        console.error("Failed to load forecast:", err);
        setError("Failed to load balance forecast.");
      } finally {
        setLoading(false);
      }
    };

    loadForecast();
  }, [incomes, expenses]);

  const lowest = forecast?.lowest_balance_day ?? null;

  const data = useMemo(() => {
    if (!forecast) {
      return [];
    }

    return forecast.balance_history.map((entry: BalanceHistoryEntry) => {
      const events = forecast.remaining_events.filter(
        (event) => event.date === entry.date,
      );

      return {
        date: entry.date,
        label: new Date(entry.date).getDate().toString(),
        balance: entry.balance,
        events,
        isToday: entry.date === new Date().toISOString().slice(0, 10),
        isLowest: lowest?.date === entry.date,
      };
    });
  }, [forecast]);

  const balances = data.map((entry) => entry.balance);

  const minBal = balances.length > 0 ? Math.min(...balances) : 0;

  const maxBal = balances.length > 0 ? Math.max(...balances) : 0;

  const range = maxBal - minBal;

  const allPositive = minBal >= 0;
  const allNegative = maxBal <= 0;

  const zeroStop =
    range > 0
      ? Math.max(0, Math.min(100, (maxBal / range) * 100))
      : maxBal >= 0
        ? 100
        : 0;

  const yDomain: [number, number] = [
    Math.min(minBal, 0) - Math.abs(range) * 0.1,
    maxBal + Math.abs(range) * 0.1,
  ];

  if (loading) {
    return (
      <div
        style={{
          padding: "28px 32px",
          color: "#4a6280",
          fontSize: 13,
        }}
      >
        Loading forecast...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "28px 32px",
          color: "#EF5350",
          fontSize: 13,
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      style={{
        padding: isMobile ? "20px 16px" : "28px 32px",
        maxWidth: 980,
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          margin: "0 0 22px",
          fontFamily: "'DM Mono', monospace",
          fontSize: 12,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#4a6280",
        }}
      >
        Balance Forecast · {currentMonthName()}
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: 10,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            ...cardStyle,
            padding: "16px 18px",
          }}
        >
          <div
            style={{
              color: "#4a6280",
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 7,
            }}
          >
            Monthly Income
          </div>

          <div
            style={{
              color: "#66BB6A",
              fontFamily: "'DM Mono', monospace",
              fontSize: 20,
              fontWeight: 500,
            }}
          >
            {formatCurrency(forecast?.monthly_income ?? 0)}
          </div>
        </div>

        <div
          style={{
            ...cardStyle,
            padding: "16px 18px",
          }}
        >
          <div
            style={{
              color: "#4a6280",
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 7,
            }}
          >
            Monthly Expenses
          </div>

          <div
            style={{
              color: "#F57C00",
              fontFamily: "'DM Mono', monospace",
              fontSize: 20,
              fontWeight: 500,
            }}
          >
            {formatCurrency(forecast?.monthly_expense ?? 0)}
          </div>
        </div>

        <div
          style={{
            ...cardStyle,
            padding: "16px 18px",
          }}
        >
          <div
            style={{
              color: "#4a6280",
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 7,
            }}
          >
            Net Monthly
          </div>

          <div
            style={{
              color: (forecast?.net_monthly ?? 0) >= 0 ? "#66BB6A" : "#EF5350",
              fontFamily: "'DM Mono', monospace",
              fontSize: 20,
              fontWeight: 500,
            }}
          >
            {(forecast?.net_monthly ?? 0) >= 0 ? "+" : "−"}
            {formatCurrency(Math.abs(forecast?.net_monthly ?? 0))}
          </div>
        </div>
      </div>

      {/* Forecast chart */}

      <div
        style={{
          ...cardStyle,
          padding: isMobile ? "16px 4px 8px 0" : "22px 8px 12px 0",
          marginBottom: 14,
        }}
      >
        <ResponsiveContainer width="100%" height={isMobile ? 200 : 290}>
          <AreaChart
            data={data}
            margin={{
              top: 8,
              right: 28,
              bottom: 0,
              left: 10,
            }}
          >
            <defs>
              <linearGradient id="balFill" x1="0" y1="0" x2="0" y2="1">
                {allPositive && (
                  <>
                    <stop offset="0%" stopColor="#66BB6A" stopOpacity={0.25} />
                    <stop
                      offset="100%"
                      stopColor="#66BB6A"
                      stopOpacity={0.02}
                    />
                  </>
                )}

                {allNegative && (
                  <>
                    <stop offset="0%" stopColor="#EF5350" stopOpacity={0.22} />
                    <stop
                      offset="100%"
                      stopColor="#EF5350"
                      stopOpacity={0.03}
                    />
                  </>
                )}

                {!allPositive && !allNegative && (
                  <>
                    <stop offset="0%" stopColor="#66BB6A" stopOpacity={0.22} />
                    <stop
                      offset={`${zeroStop - 0.5}%`}
                      stopColor="#66BB6A"
                      stopOpacity={0.04}
                    />
                    <stop
                      offset={`${zeroStop + 0.5}%`}
                      stopColor="#EF5350"
                      stopOpacity={0.04}
                    />
                    <stop offset="100%" stopColor="#EF5350" stopOpacity={0.2} />
                  </>
                )}
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="2 6"
              stroke="#162030"
              vertical={false}
            />

            <XAxis
              dataKey="label"
              tick={{
                fill: "#4a6280",
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
              }}
              axisLine={false}
              tickLine={false}
              interval={2}
            />

            <YAxis
              tick={{
                fill: "#4a6280",
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
              }}
              tickFormatter={(value) => {
                if (Math.abs(value) >= 1000) {
                  return `RM ${(value / 1000).toFixed(1)}k`;
                }

                return `RM ${value}`;
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              content={<ChartTooltip />}
              cursor={{
                stroke: "#2a4060",
                strokeWidth: 1,
              }}
            />

            <ReferenceLine
              y={0}
              stroke="#253a54"
              strokeDasharray="4 6"
              strokeWidth={1}
            />

            <Area
              type="monotone"
              dataKey="balance"
              stroke={allNegative ? "#EF5350" : "#66BB6A"}
              strokeWidth={1.8}
              fill="url(#balFill)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#66BB6A",
                stroke: "#070c1a",
                strokeWidth: 2,
              }}
            />

            {lowest && (
              <ReferenceDot
                x={new Date(lowest.date).getDate().toString()}
                y={lowest.balance}
                r={5}
                fill="#EF5350"
                stroke="#070c1a"
                strokeWidth={2}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Lowest balance */}

      {lowest && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "#140a14",
            border: "1px solid #301828",
            borderRadius: 6,
            padding: "10px 18px",
            marginBottom: 28,
            fontSize: 13,
          }}
        >
          <span
            style={{
              color: "#EF5350",
              fontSize: 11,
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.08em",
            }}
          >
            ▼ LOWEST POINT
          </span>

          <span
            style={{
              color: "#4a6280",
              margin: "0 4px",
            }}
          >
            on
          </span>

          <span
            style={{
              color: "#EF5350",
              fontFamily: "'DM Mono', monospace",
              fontWeight: 500,
            }}
          >
            {lowest.date}
          </span>

          <span
            style={{
              color: "#4a6280",
              margin: "0 4px",
            }}
          >
            —
          </span>

          <span
            style={{
              color: lowest.balance >= 0 ? "#c4d4ea" : "#EF5350",
              fontFamily: "'DM Mono', monospace",
              fontWeight: 500,
            }}
          >
            {formatCurrencyFull(lowest.balance)}
          </span>

          {lowest.balance < 0 && (
            <span
              style={{
                color: "#EF5350",
                fontSize: 12,
                marginLeft: 4,
              }}
            >
              Balance overdrawn
            </span>
          )}
        </div>
      )}
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#4a6280",
          marginBottom: 12,
        }}
      >
        Remaining This Month
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {forecast.remaining_events.length === 0 ? (
          <div
            style={{
              color: "#3a5570",
              fontSize: 13,
              padding: "12px 0",
            }}
          >
            No more events scheduled this month.
          </div>
        ) : (
          forecast.remaining_events.map((event, index) => (
            <div
              key={`${event.date}-${event.name}-${index}`}
              style={{
                display: "flex",
                alignItems: "center",
                padding: isMobile ? "10px 12px" : "10px 16px",
                borderRadius: 5,
                background: "#0b1420",
                gap: isMobile ? 8 : 12,
                flexWrap: isMobile ? "wrap" : "nowrap",
              }}
            >
              <span
                style={{
                  color: "#3a5570",
                  fontSize: 11,
                  fontFamily: "'DM Mono', monospace",
                  minWidth: 84,
                }}
              >
                {event.date}
              </span>

              <span
                style={{
                  fontSize: 9,
                  fontFamily: "'DM Mono', monospace",
                  letterSpacing: "0.1em",
                  padding: "2px 8px",
                  borderRadius: 3,
                  flexShrink: 0,
                  background: event.kind === "income" ? "#081e12" : "#1c1408",
                  color: event.kind === "income" ? "#66BB6A" : "#F57C00",
                  border:
                    event.kind === "income"
                      ? "1px solid #0c2e1c"
                      : "1px solid #2c1e0a",
                }}
              >
                {event.kind.toUpperCase()}
              </span>

              <span
                style={{
                  flex: 1,
                  color: "#b8cce0",
                  fontSize: isMobile ? 13 : 14,
                  minWidth: isMobile ? "100%" : "auto",
                  order: isMobile ? 3 : 0,
                }}
              >
                {event.name}
              </span>

              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: isMobile ? 13 : 14,
                  color: event.kind === "income" ? "#66BB6A" : "#b8cce0",
                  marginLeft: "auto",
                }}
              >
                {event.kind === "income" ? "+" : "−"}
                {formatCurrency(event.amount)}
              </span>
            </div>
          ))
        )}
      </div>
      {(!forecast || forecast.balance_history.length === 0) && (
        <div
          style={{
            color: "#3a5570",
            fontSize: 13,
            padding: "12px 0",
          }}
        >
          No forecast data available.
        </div>
      )}
    </div>
  );
}

import { formatCurrencyFull } from "@/utils/format";
import { cardStyle } from "@/styles/theme";

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      date: string;
      balance: number;
    };
  }>;
}

export function ChartTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div
      style={{
        ...cardStyle,
        padding: "12px 16px",
        fontSize: 13,
        minWidth: 180,
      }}
    >
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: "#4a6280",
          marginBottom: 6,
          letterSpacing: "0.08em",
        }}
      >
        {data.date}
      </div>

      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 18,
          fontWeight: 500,
          color: data.balance >= 0 ? "#0fd47a" : "#f23458",
        }}
      >
        {formatCurrencyFull(data.balance)}
      </div>
    </div>
  );
}

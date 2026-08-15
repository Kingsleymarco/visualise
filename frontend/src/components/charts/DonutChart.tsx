import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { DonutSlice } from "@/models/financial";
import { formatCurrency } from "@/utils/format";

interface DonutChartProps {
  data: DonutSlice[];
  palette: string[];
  centerLabel: string;
  centerValue: string;
}

export function DonutChart({
  data,
  palette,
  centerLabel,
  centerValue,
}: DonutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!data.length || data.every((slice) => slice.value === 0)) {
    return (
      <div
        style={{
          height: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#3a5570",
          fontSize: 13,
        }}
      >
        Nothing to show yet.
      </div>
    );
  }

  const totalValue = data.reduce((sum, slice) => sum + slice.value, 0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div style={{ position: "relative" }}>
        <ResponsiveContainer width={180} height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={84}
              paddingAngle={2}
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={palette[index % palette.length]}
                  opacity={
                    activeIndex === null || activeIndex === index ? 1 : 0.3
                  }
                  style={{
                    outline: "none",
                    cursor: "default",
                    transition: "opacity 0.12s",
                  }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 16,
              fontWeight: 500,
              color: "#c4d4ea",
            }}
          >
            {activeIndex !== null
              ? formatCurrency(data[activeIndex].value)
              : centerValue}
          </div>
          <div
            style={{
              color: "#4a6280",
              fontSize: 9,
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.08em",
              marginTop: 3,
            }}
          >
            {activeIndex !== null
              ? data[activeIndex].name.toUpperCase().slice(0, 16)
              : centerLabel}
          </div>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {data.map((slice, index) => {
          const percentage =
            totalValue > 0 ? Math.round((slice.value / totalValue) * 100) : 0;

          return (
            <div
              key={index}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                opacity:
                  activeIndex === null || activeIndex === index ? 1 : 0.35,
                transition: "opacity 0.12s",
                cursor: "default",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: palette[index % palette.length],
                  flexShrink: 0,
                }}
              />
              <span style={{ flex: 1, color: "#8aabcc", fontSize: 12 }}>
                {slice.name}
              </span>
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  color: "#4a6280",
                }}
              >
                {percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

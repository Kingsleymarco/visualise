import { useState } from "react";
import type { Income } from "@/models/financial";
import { formatCurrency } from "@/utils/format";
import { IconButton } from "@/components/common/IconButton";
import { PencilIcon } from "@/components/common/PencilIcon";

interface IncomeRowProps {
  income: Income;
  onEdit: () => void;
  onRemove: () => void;
}

export function IncomeRow({ income, onEdit, onRemove }: IncomeRowProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "13px 16px",
        background: hovered ? "#0f1a28" : "#0b1420",
        borderRadius: 6,
        border: `1px solid ${hovered ? "#1c2e48" : "transparent"}`,
        gap: 14,
        transition: "all 0.12s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          width: 3,
          height: 34,
          borderRadius: 2,
          background: "#388E3C",
          flexShrink: 0,
        }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            color: "#c4d4ea",
            fontSize: 14,
            marginBottom: 3,
          }}
        >
          {income.label}
        </div>

        <div
          style={{
            color: "#3a5570",
            fontSize: 12,
          }}
        >
          {income.recurrence ?? "Once"}

          {income.recurrence === "Custom" &&
            income.recurrence_interval !== null &&
            ` · Every ${income.recurrence_interval} days`}

          <span
            style={{
              color: "#2e4a68",
              margin: "0 6px",
            }}
          >
            ·
          </span>

          <span style={{ color: "#4a6e90" }}>Starts: {income.start_date}</span>
        </div>
      </div>

      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 16,
          fontWeight: 500,
          color: "#66BB6A",
        }}
      >
        {formatCurrency(income.amount)}
      </div>

      <IconButton onClick={onEdit} title="Edit">
        <PencilIcon color={hovered ? "#A5D6A7" : "#3a5570"} />
      </IconButton>

      <IconButton onClick={onRemove} title="Remove" danger>
        <span style={{ fontSize: 18, lineHeight: 1 }}>×</span>
      </IconButton>
    </div>
  );
}

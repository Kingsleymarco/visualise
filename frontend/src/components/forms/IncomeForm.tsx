import { useState } from "react";
import type { IncomeFormData, Recurrence } from "@/models/financial";
import { RECURRENCE_OPTIONS } from "@/constants/constant";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { labelStyle, inputStyle, cardStyle } from "@/styles/theme";

interface IncomeFormProps {
  initial: IncomeFormData;
  onSave: (form: IncomeFormData) => void;
  onCancel: () => void;
  saveLabel: string;
}

export function IncomeForm({
  initial,
  onSave,
  onCancel,
  saveLabel,
}: IncomeFormProps) {
  const [form, setForm] = useState<IncomeFormData>(initial);

  const isMobile = useWindowWidth() < 640;

  const update = (patch: Partial<IncomeFormData>) => {
    setForm((current) => ({ ...current, ...patch }));
  };

  const isCustom = form.recurrence === "Custom";

  const isValid =
    form.label.trim() !== "" &&
    parseFloat(form.amount) > 0 &&
    form.start_date !== "" &&
    (!isCustom ||
      (form.recurrence_interval !== "" &&
        Number(form.recurrence_interval) >= 1));

  return (
    <div style={{ ...cardStyle, padding: 22 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 14,
          marginBottom: 16,
        }}
      >
        <div>
          <label style={labelStyle}>Label</label>
          <input
            value={form.label}
            onChange={(event) => update({ label: event.target.value })}
            placeholder="e.g. Salary"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Amount</label>

          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#4a6280",
                fontFamily: "'DM Mono', monospace",
                pointerEvents: "none",
              }}
            >
              RM
            </span>

            <input
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(event) => update({ amount: event.target.value })}
              placeholder="0.00"
              style={{ ...inputStyle, paddingLeft: 32 }}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Recurrence</label>

          <select
            value={form.recurrence}
            onChange={(event) =>
              update({
                recurrence: event.target.value as Recurrence,
                recurrence_interval:
                  event.target.value === "Custom"
                    ? form.recurrence_interval
                    : "",
              })
            }
            style={inputStyle}
          >
            {RECURRENCE_OPTIONS.map((recurrence) => (
              <option key={recurrence} value={recurrence}>
                {recurrence}
              </option>
            ))}
          </select>
        </div>

        {isCustom && (
          <div>
            <label style={labelStyle}>Every</label>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="number"
                min="1"
                step="1"
                value={form.recurrence_interval}
                onChange={(event) =>
                  update({
                    recurrence_interval: event.target.value,
                  })
                }
                placeholder="e.g. 10"
                style={inputStyle}
              />

              <span
                style={{
                  color: "#4a6280",
                  fontSize: 13,
                  whiteSpace: "nowrap",
                }}
              >
                days
              </span>
            </div>
          </div>
        )}

        <div>
          <label style={labelStyle}>
            {form.recurrence === "Once" ? "Date" : "Start Date"}
          </label>

          <input
            type="date"
            value={form.start_date}
            onChange={(event) => update({ start_date: event.target.value })}
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => isValid && onSave(form)}
          disabled={!isValid}
          style={{
            background: isValid ? "#388E3C" : "#1c2e48",
            color: isValid ? "#fff" : "#3a5570",
            border: "none",
            borderRadius: 5,
            padding: "10px 22px",
            fontSize: 13,
            fontWeight: 600,
            cursor: isValid ? "pointer" : "default",
          }}
        >
          {saveLabel}
        </button>

        <button
          onClick={onCancel}
          style={{
            background: "transparent",
            color: "#4a6280",
            border: "1px solid #1c2e48",
            borderRadius: 5,
            padding: "10px 18px",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

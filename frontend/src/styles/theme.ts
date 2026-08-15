import type { CSSProperties } from "react";

export const labelStyle: CSSProperties = {
  display: "block",
  color: "#4a6280",
  fontSize: 11,
  fontFamily: "'DM Mono', monospace",
  letterSpacing: "0.09em",
  textTransform: "uppercase",
  marginBottom: 6,
};

export const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "9px 10px",
  background: "#0b1420",
  color: "#c4d4ea",
  border: "1px solid #1c2e48",
  borderRadius: 5,
  outline: "none",
  fontSize: 13,
  fontFamily: "'DM Mono', monospace",
};

export const cardStyle: CSSProperties = {
  background: "#0f1a28",
  border: "1px solid #1c2e48",
  borderRadius: 7,
};

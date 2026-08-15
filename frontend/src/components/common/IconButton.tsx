import { useState, type ReactNode } from "react";

interface IconButtonProps {
  onClick: () => void;
  children: ReactNode;
  danger?: boolean;
  title?: string;
}

export function IconButton({
  onClick,
  children,
  danger = false,
  title,
}: IconButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "none",
        border: "none",
        padding: "4px",
        cursor: "pointer",
        color: hovered ? (danger ? "#EF5350" : "#c4d4ea") : "#2e4a68",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        transition: "color 0.12s",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

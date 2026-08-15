import type { Page } from "@/models/navigation";
import { useWindowWidth } from "@/hooks/useWindowWidth";

interface AppNavigationProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const pages: Page[] = ["forecast", "income", "expenses"];

export function AppNavigation({
  currentPage,
  onPageChange,
}: AppNavigationProps) {
  const isMobile = useWindowWidth() < 640;

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        padding: isMobile ? "0 16px" : "0 32px",
        height: 50,
        borderBottom: "1px solid #121e30",
        gap: 4,
        position: "sticky",
        top: 0,
        background: "#070c1a",
        zIndex: 10,
      }}
    >
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: isMobile ? 12 : 13,
          letterSpacing: "0.18em",
          color: "#c4d4ea",
          fontWeight: 500,
          marginRight: isMobile ? 12 : 28,
        }}
      >
        Visualise
      </div>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            background: currentPage === page ? "#0f1a28" : "transparent",
            border: `1px solid ${currentPage === page ? "#1c2e48" : "transparent"}`,
            borderRadius: 5,
            padding: isMobile ? "5px 10px" : "5px 14px",
            color: currentPage === page ? "#c4d4ea" : "#3a5570",
            fontSize: isMobile ? 11 : 13,
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.06em",
            cursor: "pointer",
            transition: "all 0.12s",
            textTransform: "capitalize",
          }}
        >
          {page}
        </button>
      ))}
    </nav>
  );
}

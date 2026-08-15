export function formatCurrency(value: number): string {
  return (
    "RM " +
    new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)
  );
}

export function formatCurrencyFull(value: number): string {
  return (
    "RM " +
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  );
}

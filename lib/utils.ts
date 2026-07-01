export function formatCurrency(value: number): string {
  return `$ ${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "-";
  return `${sign}%${Math.abs(value).toFixed(2)}`;
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

const KEY = "portfoy_alerts";

export function getAlerts(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

export function persistAlerts(alerts: Record<string, number>): void {
  localStorage.setItem(KEY, JSON.stringify(alerts));
}

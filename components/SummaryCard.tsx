interface SummaryCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
}

export default function SummaryCard({ label, value, delta, deltaPositive }: SummaryCardProps) {
  return (
    <div
      className="rounded-lg border p-4 md:p-5 flex flex-col gap-1.5 md:gap-2"
      style={{ background: "var(--color-bg-2)", borderColor: "var(--color-line)" }}
    >
      <span
        className="text-xs uppercase tracking-widest font-semibold"
        style={{ color: "var(--color-text-3)" }}
      >
        {label}
      </span>
      <span
        className="font-mono text-2xl md:text-3xl font-bold"
        style={{ color: "var(--color-text)" }}
      >
        {value}
      </span>
      {delta !== undefined && (
        <span
          className="text-sm font-mono font-medium"
          style={{ color: deltaPositive ? "var(--color-green)" : "var(--color-red)" }}
        >
          {delta}
        </span>
      )}
    </div>
  );
}

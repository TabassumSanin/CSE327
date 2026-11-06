import { cn } from "@/lib/utils";

export function BarChart({
  data,
  height = 200,
  valueLabel = "donations",
  className,
}: {
  data: { label: string; value: number; secondary?: number }[];
  height?: number;
  valueLabel?: string;
  className?: string;
}) {
  const max = Math.max(...data.flatMap((item) => [item.value, item.secondary ?? 0]), 1);
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-end gap-2 sm:gap-3" style={{ height }}>
        {data.map((item) => (
          <div key={item.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
            <div className="flex h-full w-full items-end justify-center gap-1">
              {item.secondary !== undefined ? (
                <div
                  className="w-1/2 max-w-[18px] rounded-t-md bg-[#C9E0D2]"
                  style={{ height: `${(item.secondary / max) * 100}%` }}
                  title={`${item.secondary} ${valueLabel}`}
                />
              ) : null}
              <div
                className="group relative w-1/2 max-w-[26px] rounded-t-md bg-primary transition-all hover:bg-secondary"
                style={{ height: `${(item.value / max) * 100}%` }}
              >
                <span className="pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded-md bg-ink px-1.5 py-0.5 text-caption text-white group-hover:block">
                  {item.value}
                </span>
              </div>
            </div>
            <span className="text-caption text-muted">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AreaChart({
  data,
  height = 180,
}: {
  data: { label: string; value: number }[];
  height?: number;
}) {
  const width = 560;
  const max = Math.max(...data.map((item) => item.value), 1);
  const min = Math.min(...data.map((item) => item.value), 0);
  const points = data.map((item, index) => {
    const x = (index / Math.max(1, data.length - 1)) * width;
    const y = height - ((item.value - min) / Math.max(1, max - min)) * (height - 24) - 12;
    return { x, y, ...item };
  });
  const line = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Trend chart">
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B8062" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#3B8062" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((ratio) => (
          <line
            key={ratio}
            x1="0"
            x2={width}
            y1={height * ratio}
            y2={height * ratio}
            stroke="#E4EBE6"
            strokeDasharray="4 4"
          />
        ))}
        <path d={area} fill="url(#areaFill)" />
        <path d={line} fill="none" stroke="#245C45" strokeWidth="2.5" strokeLinecap="round" />
        {points.map((point) => (
          <circle key={point.label} cx={point.x} cy={point.y} r="3.5" fill="#245C45" stroke="white" strokeWidth="2" />
        ))}
      </svg>
      <div className="mt-2 flex justify-between">
        {data.map((item) => (
          <span key={item.label} className="text-caption text-muted">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function DonutChart({
  data,
  size = 176,
  centerLabel,
  centerValue,
}: {
  data: { name: string; value: number; color: string }[];
  size?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  let cumulative = 0;
  const stops = data
    .map((item) => {
      const start = (cumulative / total) * 100;
      cumulative += item.value;
      const end = (cumulative / total) * 100;
      return `${item.color} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
      <div
        className="relative grid shrink-0 place-items-center rounded-full"
        style={{ width: size, height: size, background: `conic-gradient(${stops})` }}
        role="img"
        aria-label="Distribution chart"
      >
        <div className="grid h-[68%] w-[68%] place-items-center rounded-full bg-white text-center">
          <div>
            <p className="text-[22px] font-bold leading-none text-ink">{centerValue}</p>
            <p className="mt-1 text-caption text-muted">{centerLabel}</p>
          </div>
        </div>
      </div>
      <ul className="grid w-full grid-cols-1 gap-2 sm:grid-cols-1">
        {data.map((item) => (
          <li key={item.name} className="flex items-center justify-between gap-2 text-small">
            <span className="flex min-w-0 items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: item.color }} />
              <span className="truncate text-muted">{item.name}</span>
            </span>
            <span className="font-semibold text-ink">{item.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProgressBar({
  value,
  max = 100,
  color = "#245C45",
  label,
  showValue = true,
}: {
  value: number;
  max?: number;
  color?: string;
  label?: string;
  showValue?: boolean;
}) {
  const percentage = Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between gap-3 text-caption">
          <span className="text-muted">{label}</span>
          {showValue ? <span className="font-semibold text-ink">{percentage}%</span> : null}
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-[#E8EEEA]">
        <div className="h-full rounded-full transition-all" style={{ width: `${percentage}%`, background: color }} />
      </div>
    </div>
  );
}

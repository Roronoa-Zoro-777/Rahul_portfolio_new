import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendUp, TrendDown } from "@phosphor-icons/react";

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  data: { revenue: number; target: number }[];
  dataKey: string;
}

export function KPICard({ title, value, change, data, dataKey }: KPICardProps) {
  const isPositive = change >= 0;

  return (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 shadow-sm transition-all hover:border-white/20 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <h3 className="font-mono text-[11px] font-bold uppercase tracking-widest text-white/50">
          {title}
        </h3>
        <div
          className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
            isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
          }`}
        >
          {isPositive ? <TrendUp size={12} weight="bold" /> : <TrendDown size={12} weight="bold" />}
          {Math.abs(change).toFixed(1)}%
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div className="font-sans text-3xl font-bold tracking-tight text-white">
          {value}
        </div>
        
        {/* Sparkline */}
        <div className="h-10 w-24">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={isPositive ? "#10b981" : "#ef4444"}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#gradient-${title})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

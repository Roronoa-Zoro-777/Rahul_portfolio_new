"use client";

import { useState, useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, Tab } from "@/components/dashboard/Sidebar";
import { MobileTabBar } from "@/components/dashboard/MobileTabBar";
import { Header } from "@/components/dashboard/Header";
import { KPICard } from "@/components/dashboard/KPICard";
import { PerformanceTable } from "@/components/dashboard/PerformanceTable";
import { generateMockData, filterData, aggregateByDate, aggregateByCategory, aggregateByRep, calculateKPIs, type FilterState } from "@/lib/mockDataEngine";
import type { DashboardProjectConfig } from "@/lib/dashboardConfig";
import { subDays, startOfDay } from "date-fns";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";
import { ArrowLeft } from "@phosphor-icons/react";

const subscribeToHydration = () => () => {};
const getHydratedSnapshot = () => true;
const getServerSnapshot = () => false;
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function DashboardClient({
  config,
}: {
  config: DashboardProjectConfig;
}) {
  const router = useRouter();
  const mounted = useSyncExternalStore(
    subscribeToHydration,
    getHydratedSnapshot,
    getServerSnapshot,
  );
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [filters, setFilters] = useState<FilterState>({
    dateRange: { start: subDays(startOfDay(new Date()), 30), end: startOfDay(new Date()) },
    region: null,
    category: null,
  });

  const fullData = useMemo(() => {
    if (!mounted) return [];
    const seed = config.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return generateMockData(365, seed, config.mockCategories, config.mockEntities);
  }, [mounted, config]);

  // Filter the current view based on active filters
  const currentData = useMemo(() => filterData(fullData, filters), [fullData, filters]);
  
  // Previous period for KPI comparisons (e.g., if last 30 days selected, compare to previous 30 days)
  const previousData = useMemo(() => {
    if (!filters.dateRange) return fullData; // No comparison if all time
    
    const diff = filters.dateRange.end.getTime() - filters.dateRange.start.getTime();
    const prevStart = new Date(filters.dateRange.start.getTime() - diff);
    const prevEnd = new Date(filters.dateRange.end.getTime() - diff);
    
    return filterData(fullData, { ...filters, dateRange: { start: prevStart, end: prevEnd } });
  }, [fullData, filters]);

  const kpis = useMemo(() => calculateKPIs(currentData, previousData), [currentData, previousData]);
  const liveSalesValues = [
    { value: kpis.revenue.value, change: kpis.revenue.change },
    { value: kpis.orders.value, change: kpis.orders.change },
    { value: kpis.conversion.value, change: kpis.conversion.change },
    { value: kpis.aov.value, change: kpis.aov.change },
  ];
  const kpiCards = config.kpis.map((metric, index) => {
    const isSalesDashboard = config.id === "p1";
    const source = liveSalesValues[index];
    const baseValue = isSalesDashboard
      ? source.value
      : metric.sampleValue;
    const value =
      !isSalesDashboard && metric.format !== "percentage"
        ? baseValue * (fullData.length > 0 ? currentData.length / fullData.length : 0)
        : baseValue;
    const formattedValue =
      metric.format === "currency"
        ? currencyFormatter.format(value)
        : metric.format === "percentage"
          ? `${value.toFixed(1)}%`
          : metric.format === "decimal"
            ? value.toFixed(1)
            : Math.round(value).toLocaleString();

    return {
      title: metric.label,
      value: formattedValue,
      change: isSalesDashboard ? source.change : metric.sampleChange,
    };
  });
  const trendData = useMemo(() => aggregateByDate(currentData), [currentData]);
  const categoryData = useMemo(() => aggregateByCategory(currentData), [currentData]);
  const repData = useMemo(() => aggregateByRep(currentData), [currentData]);

  // Colors for Recharts
  const COLORS = ["#ef4444", "#f87171", "#fca5a5", "#fee2e2"];

  if (!mounted) return <DashboardLoadingSkeleton />;

  return (
    <div className="flex h-screen w-full bg-[#030303] text-white overflow-hidden font-sans">
      {/* Sidebar: hidden on mobile/tablet, visible on lg+ */}
      <div className="hidden lg:flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      
      <main id="main-content" className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header 
          projectTitle={`${config.title} Analytics`}
          filters={filters}
          setFilters={setFilters}
          categories={config.mockCategories}
        />
        
        <div className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 pb-20 lg:pb-6" data-lenis-prevent>
          <p className="mb-4 rounded-lg border border-amber-400/20 bg-amber-300/5 px-3 py-2 text-xs text-amber-100/80">
            Illustrative sample data only; figures do not represent verified project results.
          </p>
          <button 
            onClick={() => router.push('/projects')}
            className="mb-4 flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back to Projects
          </button>
          
          {activeTab === "overview" && (
            <>
              {/* Top KPI Cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpiCards.map((kpi) => (
              <KPICard
                key={kpi.title}
                title={kpi.title}
                value={kpi.value}
                change={kpi.change}
                data={trendData}
                dataKey="revenue"
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Trend Chart */}
            <div className="lg:col-span-2 flex flex-col rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 shadow-sm">
              <h3 className="mb-4 font-sans text-sm font-bold text-white">{config.charts.trendTitle}</h3>
              <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="label" 
                      stroke="rgba(255,255,255,0.3)" 
                      tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.3)" 
                      tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} 
                      tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val}
                      tickLine={false}
                      axisLine={false}
                    />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="target" stroke="#555" strokeDasharray="5 5" fill="none" name="Baseline/Target" />
                    <Area type="monotone" dataKey="revenue" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" name={config.charts.trendMetric} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Distribution (Cross-filtering capable) */}
            <div className="flex flex-col rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 shadow-sm">
              <h3 className="mb-1 font-sans text-sm font-bold text-white">{config.charts.distributionTitle}</h3>
              <p className="mb-4 text-xs text-white/40">Click a slice to cross-filter the dashboard.</p>
              <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      onClick={(data) => {
                        // Implement Cross Filtering
                        setFilters({ ...filters, category: filters.category === data.name ? null : (data.name as string || null) });
                      }}
                      className="cursor-pointer outline-none"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                          opacity={filters.category && filters.category !== (entry.name as string) ? 0.3 : 1}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(val) => Number(val).toLocaleString()}
                      contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <PerformanceTable data={repData} config={config.table} />
          </div>
            </>
          )}

          {activeTab !== "overview" && (
            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0a0a0a] min-h-[400px] p-12 text-center shadow-sm">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                <span className="font-mono text-2xl font-bold text-white/40">{activeTab.charAt(0).toUpperCase()}</span>
              </div>
              <h2 className="mb-2 font-sans text-2xl font-bold text-white capitalize">{activeTab} Module</h2>
              <p className="max-w-md text-sm leading-relaxed text-white/50">
                This area is designated for the {activeTab} feature set. It will be available in a future update.
              </p>
            </div>
          )}
          
        </div>

        {/* Mobile/Tablet bottom tab bar */}
        <MobileTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>
    </div>
  );
}

function DashboardLoadingSkeleton() {
  return (
    <main
      id="main-content"
      className="min-h-screen space-y-6 bg-[#030303] p-4 text-white sm:p-6"
      aria-label="Loading analytics dashboard"
      aria-busy="true"
    >
      <div className="h-16 animate-pulse rounded-2xl bg-white/10" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-2xl bg-white/10"
          />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-80 animate-pulse rounded-2xl bg-white/10 lg:col-span-2" />
        <div className="h-80 animate-pulse rounded-2xl bg-white/10" />
      </div>
    </main>
  );
}

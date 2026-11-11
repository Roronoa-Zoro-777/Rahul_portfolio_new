import type { FilterState } from "@/lib/mockDataEngine";
import { FunnelX } from "@phosphor-icons/react";

export function Header({
  projectTitle,
  filters,
  setFilters,
  categories,
}: {
  projectTitle: string;
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  categories: string[];
}) {
  const REGIONS = ["North America", "EMEA", "APAC", "LATAM"];

  return (
    <header className="flex flex-col gap-3 border-b border-white/10 bg-[#0a0a0a] px-3 py-3 sm:px-4 sm:py-4 md:flex-row md:items-center md:justify-between md:px-6">
      <div className="min-w-0">
        <h1 className="truncate font-sans text-base font-bold tracking-tight text-white sm:text-lg md:text-xl">{projectTitle}</h1>
        <p className="text-[10px] text-white/50 sm:text-xs">Interactive Power BI Style Canvas</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Active Filters Bar */}
        {(filters.region || filters.category) && (
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-2 md:mr-4 md:border-b-0 md:border-r md:pb-0 md:pr-4">
            <span className="text-[10px] text-white/40 uppercase tracking-wider font-mono sm:text-xs">Active:</span>
            {filters.region && (
              <span className="flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-medium text-red-400 sm:px-3 sm:py-1 sm:text-xs">
                {filters.region}
              </span>
            )}
            {filters.category && (
              <span className="flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-medium text-red-400 sm:px-3 sm:py-1 sm:text-xs">
                {filters.category}
              </span>
            )}
            <button
              type="button"
              aria-label="Clear region and category filters"
              onClick={() => setFilters({ ...filters, region: null, category: null })}
              className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-white/10 text-white/50 hover:text-white"
              title="Clear all filters"
            >
              <FunnelX size={14} weight="bold" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-1">
          <select 
            aria-label="Filter by region"
            value={filters.region || ""}
            onChange={(e) => setFilters({ ...filters, region: e.target.value || null })}
            className="appearance-none bg-transparent pl-2 pr-6 py-1 text-xs text-white/80 outline-none hover:text-white focus:bg-[#1a1a1a] sm:pl-3 sm:pr-8 sm:py-1.5 sm:text-sm"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23999%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .5em top 50%', backgroundSize: '.55em auto' }}
          >
            <option value="" className="bg-[#1a1a1a]">All Regions</option>
            {REGIONS.map(r => <option key={r} value={r} className="bg-[#1a1a1a]">{r}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-1">
          <select 
            aria-label="Filter by category"
            value={filters.category || ""}
            onChange={(e) => setFilters({ ...filters, category: e.target.value || null })}
            className="appearance-none bg-transparent pl-2 pr-6 py-1 text-xs text-white/80 outline-none hover:text-white focus:bg-[#1a1a1a] sm:pl-3 sm:pr-8 sm:py-1.5 sm:text-sm"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23999%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .5em top 50%', backgroundSize: '.55em auto' }}
          >
            <option value="" className="bg-[#1a1a1a]">All Categories</option>
            {categories.map(c => <option key={c} value={c} className="bg-[#1a1a1a]">{c}</option>)}
          </select>
        </div>
      </div>
    </header>
  );
}

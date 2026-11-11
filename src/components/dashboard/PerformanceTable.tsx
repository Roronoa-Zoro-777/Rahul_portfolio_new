import { useState, useMemo } from "react";
import { CaretUp, CaretDown, MagnifyingGlass } from "@phosphor-icons/react";

interface RowData {
  rep: string;
  revenue: number;
  orders: number;
  target: number;
}

function renderSortIcon(
  columnKey: keyof RowData,
  sortConfig: { key: keyof RowData; direction: "asc" | "desc" },
) {
  if (sortConfig.key !== columnKey) {
    return <CaretDown size={12} className="opacity-40" aria-hidden="true" />;
  }
  return sortConfig.direction === "asc" ? (
    <CaretUp size={12} aria-hidden="true" />
  ) : (
    <CaretDown size={12} aria-hidden="true" />
  );
}

export function PerformanceTable({ data, config }: { data: RowData[], config: { title: string, entityName: string, metricName: string } }) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof RowData; direction: "asc" | "desc" }>({
    key: "revenue",
    direction: "desc",
  });
  const [search, setSearch] = useState("");

  const sortedData = useMemo(() => {
    let sortable = [...data];
    if (search) {
      const normalizedSearch = search.toLowerCase();
      sortable = sortable.filter((d) => d.rep.toLowerCase().includes(normalizedSearch));
    }
    sortable.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    return sortable;
  }, [data, sortConfig, search]);

  const handleSort = (key: keyof RowData) => {
    let direction: "asc" | "desc" = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]">
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <h3 className="font-sans text-sm font-bold text-white">{config.title}</h3>
        <div className="relative">
          <MagnifyingGlass size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            aria-label={`Search ${config.entityName.toLowerCase()} records`}
            placeholder={`Search ${config.entityName.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48 rounded-md border border-white/10 bg-white/5 py-1.5 pl-8 pr-3 text-xs text-white placeholder:text-white/30 outline-none focus:border-red-500/50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto" data-lenis-prevent>
        <table className="w-full text-left text-sm text-white/80">
          <thead className="sticky top-0 bg-[#0a0a0a] text-xs uppercase text-white/40 shadow-sm z-10">
            <tr>
              <th scope="col" aria-sort={sortConfig.key === "rep" ? (sortConfig.direction === "asc" ? "ascending" : "descending") : "none"} className="p-4 font-mono">
                <button type="button" className="flex items-center gap-1 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" onClick={() => handleSort("rep")}>{config.entityName} {renderSortIcon("rep", sortConfig)}</button>
              </th>
              <th scope="col" aria-sort={sortConfig.key === "revenue" ? (sortConfig.direction === "asc" ? "ascending" : "descending") : "none"} className="p-4 font-mono text-right">
                <button type="button" className="ml-auto flex items-center justify-end gap-1 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" onClick={() => handleSort("revenue")}>{config.metricName} {renderSortIcon("revenue", sortConfig)}</button>
              </th>
              <th scope="col" aria-sort={sortConfig.key === "orders" ? (sortConfig.direction === "asc" ? "ascending" : "descending") : "none"} className="p-4 font-mono text-right">
                <button type="button" className="ml-auto flex items-center justify-end gap-1 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" onClick={() => handleSort("orders")}>Volume/Orders {renderSortIcon("orders", sortConfig)}</button>
              </th>
              <th scope="col" className="p-4 font-mono text-right">Target Attainment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedData.map((row) => {
              const attainment = (row.revenue / row.target) * 100;
              let statusColor = "bg-emerald-500";
              if (attainment < 90) statusColor = "bg-red-500";
              else if (attainment < 100) statusColor = "bg-amber-500";

              return (
                <tr key={row.rep} className="transition-colors hover:bg-white/[0.02]">
                  <td className="p-4 font-medium text-white">{row.rep}</td>
                  <td className="p-4 text-right font-mono text-white/90">{currencyFormatter.format(row.revenue)}</td>
                  <td className="p-4 text-right font-mono text-white/90">{row.orders}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-3">
                      <span className="font-mono text-xs">{attainment.toFixed(1)}%</span>
                      <div
                        className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10"
                        role="progressbar"
                        aria-label={`${row.rep} target attainment`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.min(attainment, 100)}
                      >
                        <div className={`h-full rounded-full ${statusColor}`} style={{ width: `${Math.min(attainment, 100)}%` }} />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {sortedData.length === 0 && (
          <div className="p-8 text-center text-sm text-white/40">No records found.</div>
        )}
      </div>
    </div>
  );
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

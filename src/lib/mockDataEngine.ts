import { subDays, startOfDay, isWithinInterval } from "date-fns";

export interface Transaction {
  id: string;
  date: Date;
  region: string;
  category: string;
  rep: string;
  revenue: number;
  orders: number;
  target: number;
}

const REGIONS = ["North America", "EMEA", "APAC", "LATAM"];

// Deterministic random number generator for stable mock data
let seed = 12345;
function random() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function generateMockData(days: number = 365, baseSeed: number = 1, categories: string[] = ["Cat A", "Cat B"], entities: string[] = ["Rep 1"]): Transaction[] {
  seed = baseSeed * 10000;
  const data: Transaction[] = [];
  const today = startOfDay(new Date());

  for (let i = 0; i < days; i++) {
    const currentDate = subDays(today, i);
    // 2 to 8 transactions per day
    const transactionsPerDay = Math.floor(random() * 7) + 2;

    for (let j = 0; j < transactionsPerDay; j++) {
      const region = REGIONS[Math.floor(random() * REGIONS.length)];
      const category = categories[Math.floor(random() * categories.length)];
      const rep = entities[Math.floor(random() * entities.length)];
      
      // Add some trend logic based on region/category to make it interesting
      let revenueMultiplier = 1;
      if (region === "North America") revenueMultiplier *= 1.5;
      if (category === categories[0]) revenueMultiplier *= 1.8;

      const revenue = Math.round((random() * 5000 + 1000) * revenueMultiplier);
      const orders = Math.floor(random() * 5) + 1;
      
      // Target is generally 90% to 110% of revenue
      const target = Math.round(revenue * (0.9 + random() * 0.2));

      data.push({
        id: `tx-${i}-${j}`,
        date: currentDate,
        region,
        category,
        rep,
        revenue,
        orders,
        target,
      });
    }
  }

  return data.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export interface FilterState {
  dateRange: { start: Date; end: Date } | null;
  region: string | null;
  category: string | null;
}

export function filterData(data: Transaction[], filters: FilterState): Transaction[] {
  return data.filter((row) => {
    let match = true;

    if (filters.dateRange) {
      match = match && isWithinInterval(row.date, { start: filters.dateRange.start, end: filters.dateRange.end });
    }
    if (filters.region) {
      match = match && row.region === filters.region;
    }
    if (filters.category) {
      match = match && row.category === filters.category;
    }

    return match;
  });
}

export function aggregateByDate(data: Transaction[]) {
  const result: Record<string, { date: Date; label: string; revenue: number; target: number }> = {};
  
  data.forEach((row) => {
    const key = row.date.toISOString();
    if (!result[key]) {
      // Create short label for charts (e.g. "Oct 15")
      const label = row.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      result[key] = { date: row.date, label, revenue: 0, target: 0 };
    }
    result[key].revenue += row.revenue;
    result[key].target += row.target;
  });

  return Object.values(result).sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function aggregateByCategory(data: Transaction[]) {
  const result: Record<string, number> = {};
  data.forEach((row) => {
    result[row.category] = (result[row.category] || 0) + row.revenue;
  });
  return Object.entries(result)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function aggregateByRep(data: Transaction[]) {
  const result: Record<string, { rep: string; revenue: number; orders: number; target: number }> = {};
  data.forEach((row) => {
    if (!result[row.rep]) {
      result[row.rep] = { rep: row.rep, revenue: 0, orders: 0, target: 0 };
    }
    result[row.rep].revenue += row.revenue;
    result[row.rep].orders += row.orders;
    result[row.rep].target += row.target;
  });
  return Object.values(result).sort((a, b) => b.revenue - a.revenue);
}

export function calculateKPIs(currentData: Transaction[], previousData: Transaction[]) {
  const curRev = currentData.reduce((acc, row) => acc + row.revenue, 0);
  const prevRev = previousData.reduce((acc, row) => acc + row.revenue, 0);
  
  const curOrd = currentData.reduce((acc, row) => acc + row.orders, 0);
  const prevOrd = previousData.reduce((acc, row) => acc + row.orders, 0);
  
  // AOV = Avg Order Value
  const curAov = curOrd > 0 ? curRev / curOrd : 0;
  const prevAov = prevOrd > 0 ? prevRev / prevOrd : 0;

  // Conversion = Orders / (Orders * arbitrary random factor for mock purposes)
  const curConv = curOrd / (curOrd * 12 + 50);
  const prevConv = prevOrd / (prevOrd * 12 + 50);

  const calcChange = (cur: number, prev: number) => {
    if (prev === 0) return cur > 0 ? 100 : 0;
    return ((cur - prev) / prev) * 100;
  };

  return {
    revenue: { value: curRev, change: calcChange(curRev, prevRev) },
    orders: { value: curOrd, change: calcChange(curOrd, prevOrd) },
    aov: { value: curAov, change: calcChange(curAov, prevAov) },
    conversion: { value: curConv * 100, change: calcChange(curConv, prevConv) }
  };
}

export interface DashboardProjectConfig {
  id: string;
  title: string;
  kpis: {
    key: string;
    label: string;
    format: "currency" | "number" | "percentage" | "decimal";
    sampleValue: number;
    sampleChange: number;
  }[];
  charts: {
    trendTitle: string;
    trendMetric: string;
    distributionTitle: string;
  };
  table: {
    title: string;
    entityName: string;
    metricName: string;
  };
  mockCategories: string[];
  mockEntities: string[];
}

export const dashboardConfigs: Record<string, DashboardProjectConfig> = {
  p1: {
    id: "p1",
    title: "Sales Performance",
    kpis: [
      { key: "metric1", label: "Total Revenue", format: "currency", sampleValue: 0, sampleChange: 0 },
      { key: "metric2", label: "Total Orders", format: "number", sampleValue: 0, sampleChange: 0 },
      { key: "metric3", label: "Conversion Rate", format: "percentage", sampleValue: 0, sampleChange: 0 },
      { key: "metric4", label: "Avg Order Value", format: "currency", sampleValue: 0, sampleChange: 0 },
    ],
    charts: {
      trendTitle: "Revenue vs Target",
      trendMetric: "Revenue",
      distributionTitle: "Revenue by Category",
    },
    table: {
      title: "Sales Rep Performance",
      entityName: "Sales Rep",
      metricName: "Revenue",
    },
    mockCategories: ["Software", "Hardware", "Services", "Licensing"],
    mockEntities: ["Alex Rivera", "Jordan Lee", "Taylor Smith", "Casey Chen", "Morgan Davis"],
  },
  p2: {
    id: "p2",
    title: "Customer Churn Prediction",
    kpis: [
      { key: "metric1", label: "At-Risk Customers", format: "number", sampleValue: 125, sampleChange: -2.4 },
      { key: "metric2", label: "Avg Churn Probability", format: "percentage", sampleValue: 24.6, sampleChange: -1.2 },
      { key: "metric3", label: "Retained Revenue", format: "currency", sampleValue: 425000, sampleChange: 6.8 },
      { key: "metric4", label: "Model Accuracy", format: "percentage", sampleValue: 91, sampleChange: 0.8 },
    ],
    charts: {
      trendTitle: "Churn Risk Trend",
      trendMetric: "Risk Score",
      distributionTitle: "Churn by Segment",
    },
    table: {
      title: "High-Risk Accounts",
      entityName: "Account ID",
      metricName: "Risk Score",
    },
    mockCategories: ["Enterprise", "SMB", "Startup", "Individual"],
    mockEntities: ["Acme Corp", "Globex", "Initech", "Soylent", "Umbrella Corp"],
  },
  p3: {
    id: "p3",
    title: "E-Commerce Analytics Pipeline",
    kpis: [
      { key: "metric1", label: "Data Volume (GB)", format: "decimal", sampleValue: 48.5, sampleChange: 4.2 },
      { key: "metric2", label: "Daily Records", format: "number", sampleValue: 52000, sampleChange: 3.1 },
      { key: "metric3", label: "Pipeline Latency (ms)", format: "number", sampleValue: 180, sampleChange: -5.4 },
      { key: "metric4", label: "Success Rate", format: "percentage", sampleValue: 99.3, sampleChange: 0.2 },
    ],
    charts: {
      trendTitle: "Data Processing Volume",
      trendMetric: "Volume (GB)",
      distributionTitle: "Data by Source",
    },
    table: {
      title: "ETL Job Performance",
      entityName: "Job Name",
      metricName: "Rows Processed",
    },
    mockCategories: ["Web Analytics", "Transactions", "User Profiles", "Inventory"],
    mockEntities: ["Extract_Sales", "Load_Users", "Transform_Web", "Cleanse_Data", "Sync_CRM"],
  },
  p4: {
    id: "p4",
    title: "HR Attrition Analysis",
    kpis: [
      { key: "metric1", label: "Total Headcount", format: "number", sampleValue: 1470, sampleChange: 1.8 },
      { key: "metric2", label: "Turnover Rate", format: "percentage", sampleValue: 16.4, sampleChange: -0.6 },
      { key: "metric3", label: "Avg Tenure (Yrs)", format: "decimal", sampleValue: 3.8, sampleChange: 2.1 },
      { key: "metric4", label: "New Hires", format: "number", sampleValue: 84, sampleChange: 7.3 },
    ],
    charts: {
      trendTitle: "Headcount Growth",
      trendMetric: "Employees",
      distributionTitle: "Attrition by Department",
    },
    table: {
      title: "Department Retention Metrics",
      entityName: "Department",
      metricName: "Retention Rate",
    },
    mockCategories: ["Engineering", "Sales", "Marketing", "Operations", "HR"],
    mockEntities: ["Eng Team A", "Eng Team B", "Enterprise Sales", "Inbound Marketing", "Recruiting"],
  },
  p5: {
    id: "p5",
    title: "Social Media Sentiment",
    kpis: [
      { key: "metric1", label: "Posts Analyzed", format: "number", sampleValue: 25000, sampleChange: 8.4 },
      { key: "metric2", label: "Global Sentiment", format: "percentage", sampleValue: 76.4, sampleChange: 2.7 },
      { key: "metric3", label: "Brand Mentions", format: "number", sampleValue: 8700, sampleChange: 5.2 },
      { key: "metric4", label: "Engagement Rate", format: "percentage", sampleValue: 5.2, sampleChange: 0.4 },
    ],
    charts: {
      trendTitle: "Sentiment Trend Over Time",
      trendMetric: "Sentiment Score",
      distributionTitle: "Sentiment Breakdown",
    },
    table: {
      title: "Trending Topics",
      entityName: "Keyword",
      metricName: "Mentions",
    },
    mockCategories: ["Positive", "Neutral", "Negative", "Mixed"],
    mockEntities: ["#launch", "product update", "customer service", "pricing", "new feature"],
  },
  p6: {
    id: "p6",
    title: "Supply Chain Optimization",
    kpis: [
      { key: "metric1", label: "Active SKUs", format: "number", sampleValue: 2400, sampleChange: 2.3 },
      { key: "metric2", label: "Avg Lead Time (Days)", format: "decimal", sampleValue: 4.2, sampleChange: -3.1 },
      { key: "metric3", label: "Inventory Value", format: "currency", sampleValue: 1200000, sampleChange: 1.7 },
      { key: "metric4", label: "On-Time Delivery", format: "percentage", sampleValue: 94.2, sampleChange: 4.6 },
    ],
    charts: {
      trendTitle: "Inventory Value Trend",
      trendMetric: "Value",
      distributionTitle: "Inventory by Warehouse",
    },
    table: {
      title: "Supplier Performance",
      entityName: "Supplier Name",
      metricName: "On-Time %",
    },
    mockCategories: ["Warehouse A (East)", "Warehouse B (West)", "Warehouse C (Central)", "3PL Partners"],
    mockEntities: ["Apex Logistics", "Global Freight", "FastTrack Inc.", "Prime Shipping", "Direct Route"],
  }
};

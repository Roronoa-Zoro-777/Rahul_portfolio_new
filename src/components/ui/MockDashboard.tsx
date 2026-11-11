"use client";

import { useState, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Metric {
  label: string;
  value: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  metrics: Metric[];
}

export function MockDashboard({ project }: { project: Project }) {
  const [activeMetricIndex, setActiveMetricIndex] = useState(0);
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  const activeMetric = project.metrics[activeMetricIndex];

  // Generate deterministic but dynamic-looking data based on the project id and active metric
  const chartData = useMemo(() => {
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Create a base multiplier from the metric value
    const numValue = parseFloat(activeMetric.value.replace(/[^0-9.]/g, "")) || 100;
    
    // Generate data points
    const data = labels.map((_, i) => {
      // Add some math sine wave variation based on metric index and month
      const variation = Math.sin((i + activeMetricIndex) * 0.8) * 0.3 + 1; 
      return Math.round(numValue * variation * (i + 1) * 1.5);
    });

    return {
      labels,
      datasets: [
        {
          label: `${activeMetric.label} Trend`,
          data,
          borderColor: "rgba(220, 0, 0, 1)", // Blood Red
          backgroundColor: "rgba(220, 0, 0, 0.2)",
          borderWidth: 2,
          pointBackgroundColor: "rgba(255, 255, 255, 1)", // White points
          pointBorderColor: "rgba(220, 0, 0, 1)",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.4, // Smooth curve
        },
      ],
    };
  }, [activeMetric, activeMetricIndex]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    color: "rgba(255, 255, 255, 0.7)", // Semi-transparent white text
    plugins: {
      legend: {
        labels: {
          color: "rgba(255, 255, 255, 0.9)",
          font: {
            family: "'Inter', sans-serif",
            size: 13,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "rgba(255, 255, 255, 1)",
        bodyColor: "rgba(255, 255, 255, 0.8)",
        borderColor: "rgba(255, 0, 0, 0.3)",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.5)",
          font: { family: "'Inter', sans-serif" },
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.5)",
          font: { family: "'Inter', sans-serif" },
        },
      },
    },
  };

  return (
    <div className="flex h-full w-full flex-col p-4 text-white overflow-y-auto">
      {/* Dashboard Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white/90">
            {project.title} <span className="text-red-600 font-light ml-2">Overview</span>
          </h2>
          <p className="text-sm text-white/50 mt-1">Interactive Data Visualization Environment</p>
        </div>
        
        {/* Controls */}
        <div className="flex gap-2 bg-white/5 p-1 rounded-lg border border-white/10 w-fit backdrop-blur-md">
          <button
            type="button"
            aria-pressed={chartType === "line"}
            onClick={() => setChartType("line")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${chartType === "line" ? "bg-red-600/80 text-white shadow-[0_0_15px_rgba(220,0,0,0.4)]" : "text-white/60 hover:text-white hover:bg-white/10"}`}
          >
            Trend
          </button>
          <button
            type="button"
            aria-pressed={chartType === "bar"}
            onClick={() => setChartType("bar")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${chartType === "bar" ? "bg-red-600/80 text-white shadow-[0_0_15px_rgba(220,0,0,0.4)]" : "text-white/60 hover:text-white hover:bg-white/10"}`}
          >
            Distribution
          </button>
        </div>
      </div>

      {/* KPI Cards (Interactive) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
        {project.metrics.map((metric, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveMetricIndex(idx)}
            aria-pressed={activeMetricIndex === idx}
            className={`group relative flex flex-col items-start justify-between rounded-xl border p-5 text-left transition-all duration-300 overflow-hidden ${
              activeMetricIndex === idx
                ? "border-red-500/50 bg-red-950/30 shadow-[0_0_30px_-5px_rgba(220,0,0,0.3)]"
                : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
            }`}
          >
            {/* Glassmorphism gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
            
            <span className="relative font-mono text-[10px] uppercase tracking-widest text-white/50 mb-2 group-hover:text-white/70 transition-colors">
              {metric.label}
            </span>
            <span className={`relative font-sans text-3xl font-bold tracking-tight transition-colors ${activeMetricIndex === idx ? "text-red-500" : "text-white/90"}`}>
              {metric.value}
            </span>
            
            {/* Active indicator line */}
            <div className={`absolute bottom-0 left-0 h-1 bg-red-600 transition-all duration-300 ${activeMetricIndex === idx ? "w-full" : "w-0 group-hover:w-1/4"}`} />
          </button>
        ))}
      </div>

      {/* Main Chart Area */}
      <div className="relative flex-1 min-h-[300px] w-full rounded-xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md flex flex-col">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-red-500/[0.02] to-transparent pointer-events-none rounded-xl" />
        <h3 className="text-sm font-medium text-white/60 mb-4 ml-2">
          Analyzing: <span className="text-white/90 font-bold">{activeMetric.label}</span>
        </h3>
        
        <div className="relative flex-1 w-full pb-2">
          {chartType === "line" ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <Bar data={{
              ...chartData,
              datasets: [{
                ...chartData.datasets[0],
                backgroundColor: "rgba(220, 0, 0, 0.7)",
                hoverBackgroundColor: "rgba(255, 50, 50, 0.9)",
              }]
            }} options={chartOptions} />
          )}
        </div>
      </div>
      
      {/* Tech Stack Footer */}
      <div className="mt-6 flex flex-wrap gap-2 items-center">
        <span className="text-xs text-white/40 mr-2">Powered by:</span>
        {project.tech.map((t) => (
          <span
            key={t}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white/60"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

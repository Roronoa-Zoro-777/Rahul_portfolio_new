"use client";

import Link from "next/link";
import { useState } from "react";
import { Navbar } from "@/components/ui/Navbar";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { ArrowUpRight } from "@phosphor-icons/react";

const projects = [
  {
    id: "p1",
    category: "BI & Visualization",
    title: "Sales Performance Dashboard",
    description:
      "Built an end-to-end interactive dashboard tracking regional sales KPIs, revenue trends, and product-level performance across 12 months of transaction data. Enabled the sales team to identify underperforming regions and optimize territory allocation.",
    tech: ["Power BI", "DAX", "SQL", "Excel"],
    metrics: [
      { label: "Data Points", value: "120K+" },
      { label: "KPIs Tracked", value: "24" },
      { label: "Regions", value: "8" },
    ],
    color: "from-blue-500/20 to-indigo-500/10",
    githubUrl: "",
  },
  {
    id: "p2",
    category: "Machine Learning",
    title: "Customer Churn Prediction",
    description:
      "Developed a machine learning pipeline to predict customer churn using historical behavioral data. Applied feature engineering, class balancing, and ensemble models to achieve 91% recall on at-risk customers.",
    tech: ["Python", "Scikit-learn", "Pandas", "Matplotlib"],
    metrics: [
      { label: "Accuracy", value: "89%" },
      { label: "Recall", value: "91%" },
      { label: "Features", value: "42" },
    ],
    color: "from-emerald-500/20 to-teal-500/10",
    githubUrl: "",
  },
  {
    id: "p3",
    category: "Data Engineering",
    title: "E-Commerce Analytics Pipeline",
    description:
      "Designed and implemented an ETL pipeline processing raw e-commerce transaction logs into a clean star-schema data warehouse. Created automated daily refresh workflows and downstream Tableau dashboards for the ops team.",
    tech: ["SQL", "PostgreSQL", "Python", "Tableau"],
    metrics: [
      { label: "Daily Records", value: "50K+" },
      { label: "Tables", value: "18" },
      { label: "Dashboards", value: "6" },
    ],
    color: "from-amber-500/20 to-orange-500/10",
    githubUrl: "",
  },
  {
    id: "p4",
    category: "BI & Visualization",
    title: "HR Attrition Analysis",
    description:
      "Conducted exploratory data analysis on employee attrition data to uncover key drivers of turnover. Built an interactive Excel workbook with pivot tables and conditional formatting, plus a Tableau story for leadership presentations.",
    tech: ["Excel", "Tableau", "Python", "Statistics"],
    metrics: [
      { label: "Employees", value: "1,470" },
      { label: "Variables", value: "35" },
      { label: "Insights", value: "12" },
    ],
    color: "from-rose-500/20 to-pink-500/10",
    githubUrl: "",
  },
  {
    id: "p5",
    category: "Machine Learning",
    title: "Social Media Sentiment Analysis",
    description:
      "Scraped and analyzed 25K+ social media posts using NLP techniques to classify brand sentiment. Built a real-time sentiment tracker with trending topic detection and weekly automated reports.",
    tech: ["Python", "NLTK", "Pandas", "Plotly"],
    metrics: [
      { label: "Posts Analyzed", value: "25K+" },
      { label: "Accuracy", value: "87%" },
      { label: "Brands", value: "5" },
    ],
    color: "from-violet-500/20 to-purple-500/10",
    githubUrl: "",
  },
  {
    id: "p6",
    category: "BI & Visualization",
    title: "Supply Chain Optimization Dashboard",
    description:
      "Created a comprehensive Power BI dashboard tracking inventory levels, supplier lead times, and logistics KPIs across 3 warehouses. Identified bottlenecks that reduced average delivery time by 18%.",
    tech: ["Power BI", "DAX", "SQL", "Python"],
    metrics: [
      { label: "SKUs", value: "2,400+" },
      { label: "Warehouses", value: "3" },
      { label: "Time Saved", value: "18%" },
    ],
    color: "from-cyan-500/20 to-sky-500/10",
    githubUrl: "",
  },
];

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", ...new Set(projects.map((project) => project.category))];
  const visibleProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  return (
    <>
      <Navbar />
      <main id="main-content" className="relative min-h-screen bg-background">
        {/* ─── Hero ─── */}
        <section className="page-hero border-b border-red-300/15 px-6 pb-16 pt-32 md:px-10 md:pb-24 md:pt-40">
          <div className="mx-auto max-w-[1400px]">
            <AnimatedSection className="flex flex-col gap-6">
              <AnimatedItem>
                <EyebrowBadge>ARCHIVES // PROJECT DATABASE</EyebrowBadge>
              </AnimatedItem>
              <AnimatedItem>
                <h1 className="max-w-[18ch] font-sans text-5xl font-bold leading-[0.95] tracking-tighter text-white md:text-7xl lg:text-8xl">
                  Project
                  <br />
                  <span className="text-accent">archives.</span>
                </h1>
              </AnimatedItem>
              <AnimatedItem>
                <p className="max-w-[52ch] font-sans text-base leading-relaxed text-zinc-400 md:text-lg">
                  A collection of data analysis, visualization, and engineering projects —
                  each one a real-world problem turned into actionable insight.
                </p>
              </AnimatedItem>
            </AnimatedSection>
          </div>
        </section>

        {/* ─── Project Grid ─── */}
        <section className="skills-section px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-[1400px]">
            <div
              className="mb-8 flex flex-wrap gap-2"
              role="group"
              aria-label="Filter projects by category"
            >
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  aria-pressed={activeFilter === filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full border px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    activeFilter === filter
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-white/15 text-white/70 hover:border-accent/50 hover:text-accent"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <AnimatedSection className="grid gap-5 md:grid-cols-2">
              {visibleProjects.map((project) => (
                <AnimatedItem key={project.id}>
                  <article className="liquid-glass group h-full rounded-2xl p-6 transition-all duration-400 hover:scale-[1.02] hover:border-white/20 md:p-8">
                    <div className="flex h-full flex-col gap-5">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-2">
                          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                            {project.id.toUpperCase()} — PROJECT
                          </span>
                          <h3 className="font-sans text-xl font-bold tracking-tight text-white md:text-2xl">
                            {project.title}
                          </h3>
                        </div>
                        <Link
                          href={`/dashboard/${project.id}`}
                          aria-label={`Open ${project.title} interactive preview`}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-zinc-400 transition-all duration-300 group-hover:border-accent/40 group-hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                          <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
                        </Link>
                      </div>

                      {/* Description */}
                      <p className="font-sans text-sm leading-relaxed text-white/65">
                        {project.description}
                      </p>

                      {/* Metrics */}
                      <div className="flex flex-wrap gap-3">
                        {project.metrics.map((m) => (
                          <div
                            key={m.label}
                            className={`metric-glass flex-1 rounded-xl p-3 text-center`}
                          >
                            <span className="block font-sans text-lg font-bold text-white">
                              {m.value}
                            </span>
                            <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-400">
                              {m.label}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Tech Stack */}
                      <div className="mt-auto flex flex-wrap gap-2">
                        {project.tech.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-white/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white/75"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                        <Link
                          href={`/dashboard/${project.id}`}
                          className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-wider text-accent transition-colors hover:bg-accent hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                          Interactive preview
                          <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
                        </Link>
                        {project.githubUrl ? (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/70 underline-offset-4 hover:text-accent hover:underline"
                          >
                            GitHub
                          </a>
                        ) : (
                          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                            GitHub link pending
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                </AnimatedItem>
              ))}
            </AnimatedSection>
          </div>
        </section>


      </main>
    </>
  );
}

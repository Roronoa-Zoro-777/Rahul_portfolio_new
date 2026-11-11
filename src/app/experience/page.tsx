"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useInView, animate } from "framer-motion";
import { Navbar } from "@/components/ui/Navbar";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { GraduationCap, Trophy, DownloadSimple, RocketLaunch, Target, ChartLineUp } from "@phosphor-icons/react";

const experiences = [
  {
    id: "exp_super",
    role: "Software Development Intern [Full Stack]",
    company: "SuperMentr",
    period: "Feb 2026 – May 2026",
    location: "Bengaluru, India",
    description:
      "Developed full-stack web application features supporting internal data-analysis workflows, from data ingestion through reporting. Processed and cleaned datasets to support downstream analysis, collaborating with the team to translate raw data into actionable insights.",
    skills: ["Full Stack", "Data Ingestion", "Agile", "Version Control"],
    type: "internship",
  },
  {
    id: "exp1",
    role: "Data Analytics Intern",
    company: "Deloitte",
    period: "2024",
    location: "Virtual Simulation",
    description:
      "Completed the Deloitte Data Analytics simulation, working on real-world business scenarios involving data cleaning, analysis, and dashboard creation. Delivered insights on customer behavior and operational efficiency.",
    skills: ["Data Cleaning", "Tableau", "Excel", "Business Analysis"],
    type: "internship",
  },
  {
    id: "exp2",
    role: "Data Analytics Intern",
    company: "Quantium",
    period: "2024",
    location: "Virtual Simulation",
    description:
      "Analyzed transaction data for a retail client, identifying customer purchasing patterns and recommending strategic changes. Built statistical models to validate findings and presented results to stakeholders.",
    skills: ["Python", "Statistics", "Data Visualization", "Reporting"],
    type: "internship",
  },
  {
    id: "exp3",
    role: "Data Analyst",
    company: "IBM",
    period: "2024",
    location: "Virtual Simulation",
    description:
      "Completed IBM's Data Analytics Professional simulation involving data wrangling, exploratory analysis, and building predictive models using real-world enterprise datasets.",
    skills: ["SQL", "Python", "Pandas", "Machine Learning"],
    type: "internship",
  },
  {
    id: "exp4",
    role: "Google Data Analytics Certificate",
    company: "Google / Coursera",
    period: "2023 — 2024",
    location: "Online",
    description:
      "Completed all 8 courses covering the full data analytics lifecycle: asking the right questions, data preparation, processing, analysis, sharing insights, and acting on findings using R and SQL.",
    skills: ["SQL", "R", "Spreadsheets", "Data Visualization"],
    type: "certification",
  },
];

const education = [
  {
    degree: "B.E. Computer Science and Engineering",
    institution: "T John Institute of Technology, Bengaluru",
    period: "2022 – 2026",
    description: "CGPA: 7.78 / 10. Specializing in data analysis, statistical modeling, and BI reporting.",
  },
  {
    degree: "CBSE (PCMC)",
    institution: "SVVN PU College, Neralur, Bengaluru",
    period: "2020 – 2022",
    description: "Percentage: 80%. Developed strong analytical and problem-solving skills.",
  },
];

const certifications = [
  { name: "IBM Data Analysis Certification", issuer: "IBM" },
  { name: "Data Analysis Job Simulation", issuer: "Deloitte" },
];

const achievements = [
  { value: 4, suffix: "+", label: "End-to-End Projects", icon: RocketLaunch },
  { value: 95, suffix: "%", label: "Model Accuracy (R²)", icon: Target },
  { value: 10, suffix: "K+", label: "Data Points Analyzed", icon: ChartLineUp },
  { value: 2, suffix: "", label: "Certifications", icon: Trophy },
];

function Counter({ from = 0, to, duration = 2 }: { from?: number; to: number; duration?: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView && nodeRef.current) {
      animate(from, to, {
        duration,
        ease: "easeOut",
        onUpdate: (value) => {
          if (nodeRef.current) {
            nodeRef.current.textContent = Math.round(value).toString();
          }
        },
      });
    }
  }, [inView, from, to, duration]);

  return <span ref={nodeRef}>{from}</span>;
}

export default function ExperiencePage() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: timelineScroll } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });

  return (
    <>
      <Navbar />
      <main id="main-content" className="relative min-h-screen bg-background overflow-hidden text-white">
        {/* ─── Hero ─── */}
        <section className="page-hero relative border-b border-red-300/15 px-6 pb-16 pt-32 md:px-10 md:pb-24 md:pt-40">
          <div className="mx-auto max-w-[1400px]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col gap-6"
            >
              <div>
                <EyebrowBadge>FLIGHT LOG // MISSION HISTORY</EyebrowBadge>
              </div>
              <div>
                <h1 className="max-w-[18ch] font-sans text-5xl font-bold leading-[0.95] tracking-tighter text-white md:text-7xl lg:text-8xl">
                  Mission
                  <br />
                  <span className="text-accent">log.</span>
                </h1>
              </div>
              <div>
                <p className="max-w-[52ch] font-sans text-base leading-relaxed text-zinc-400 md:text-lg">
                  Every internship, certification, and project has been a step toward mastering
                  the craft of turning data into direction.
                </p>
              </div>
              <div className="mt-4">
                <a
                  href="/resume.pdf"
                  download
                  className="inline-flex items-center gap-2.5 rounded-full border border-accent/30 bg-accent/20 px-6 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-accent backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-accent hover:text-black"
                >
                  <DownloadSimple size={16} weight="bold" />
                  Download Resume
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Key Metrics ─── */}
        <section className="skills-section border-b border-red-300/15 px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-[1400px]">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-10 flex flex-col gap-4"
            >
              <div>
                <EyebrowBadge>SYSTEMS // KEY METRICS</EyebrowBadge>
              </div>
              <h2 className="font-sans text-3xl font-bold tracking-tighter text-foreground md:text-4xl">
                At a <span className="text-accent">glance.</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
              {achievements.map((a, i) => (
                <motion.div
                  key={a.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1, duration: 0.5, type: "spring" }}
                  className="metric-glass flex flex-col items-center gap-3 rounded-3xl border border-white/5 bg-white/5 p-6 text-center transition-all hover:bg-white/10 md:p-8"
                >
                  <a.icon size={36} weight="duotone" className="text-accent drop-shadow-md mb-2" />
                  <div className="flex items-baseline font-sans text-3xl font-bold text-white md:text-5xl">
                    <Counter to={a.value} />
                    <span className="text-accent">{a.suffix}</span>
                  </div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                    {a.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Animated Timeline (Experience) ─── */}
        <section className="skills-section border-b border-red-300/15 px-6 py-16 md:px-10 md:py-32 overflow-hidden">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-20 flex flex-col gap-4 text-center items-center">
              <EyebrowBadge>TIMELINE // EXPERIENCE</EyebrowBadge>
              <h2 className="mt-2 font-sans text-4xl font-bold tracking-tighter text-foreground md:text-5xl">
                The journey <span className="text-accent">so far.</span>
              </h2>
            </div>

            <div ref={timelineRef} className="relative mx-auto max-w-5xl pb-10" style={{ perspective: "1500px" }}>
              {/* Dynamic Scroll Line */}
              <div className="absolute bottom-0 left-[27px] top-0 w-0.5 bg-white/10 md:left-1/2 md:-translate-x-1/2">
                <motion.div
                  className="h-full w-full origin-top bg-gradient-to-b from-accent to-red-500 shadow-[0_0_15px_rgba(212,162,47,0.8)]"
                  style={{ scaleY: timelineScroll }}
                />
              </div>

              <div className="flex flex-col gap-24">
                {experiences.map((exp, index) => {
                  const isEven = index % 2 === 0;
                  return (
                    <div key={exp.id} className="relative flex w-full items-center">
                      {/* Timeline Dot with Glow */}
                      <motion.div
                        initial={{ scale: 0, backgroundColor: "#111" }}
                        whileInView={{
                          scale: [0, 1.5, 1],
                          backgroundColor: ["#111", "#f4bd45", "#f4bd45"],
                          boxShadow: ["0px 0px 0px rgba(212,162,47,0)", "0px 0px 20px rgba(212,162,47,0.8)", "0px 0px 10px rgba(212,162,47,0.5)"]
                        }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5 }}
                        className="absolute left-[19px] z-10 flex h-5 w-5 items-center justify-center rounded-full border-2 border-accent md:left-1/2 md:-translate-x-1/2"
                      />

                      {/* 3D Alternating Card */}
                      <motion.div
                        initial={{
                          opacity: 0,
                          x: isEven ? -50 : 50,
                          rotateY: isEven ? -15 : 15,
                        }}
                        whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7, type: "spring", bounce: 0.2 }}
                        className={`w-full pl-20 md:w-1/2 md:pl-0 ${
                          isEven ? "md:pr-16 md:text-right" : "md:ml-auto md:pl-16 md:text-left"
                        }`}
                      >
                        <article className={`liquid-glass flex flex-col gap-4 rounded-3xl p-6 md:p-8 transition-transform hover:-translate-y-2 ${isEven ? "md:items-end" : "md:items-start"}`}>
                          <div className={`flex w-full flex-col gap-2 ${isEven ? "md:items-end" : "md:items-start"}`}>
                            <span className="inline-block rounded-full border border-accent/25 bg-accent/[0.08] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                              {exp.period}
                            </span>
                            <h3 className="font-sans text-xl font-bold tracking-tight text-white md:text-2xl">
                              {exp.role}
                            </h3>
                            <span className="font-sans text-sm text-accent/80">
                              {exp.company} • {exp.location}
                            </span>
                          </div>
                          <p className={`font-sans text-sm leading-relaxed text-white/70 ${isEven ? "md:text-right" : "md:text-left"}`}>
                            {exp.description}
                          </p>
                          <div className={`flex flex-wrap gap-2 pt-2 ${isEven ? "md:justify-end" : "md:justify-start"}`}>
                            {exp.skills.map((s) => (
                              <span
                                key={s}
                                className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white/75"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </article>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Education & Certifications ─── */}
        <section className="skills-section px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-16 flex flex-col gap-4 text-center items-center">
              <EyebrowBadge>TRAINING // EDUCATION</EyebrowBadge>
              <h2 className="mt-2 font-sans text-4xl font-bold tracking-tighter text-foreground md:text-5xl">
                Academic <span className="text-accent">foundation.</span>
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="flex flex-col gap-6">
                {education.map((edu, i) => (
                  <motion.article
                    key={edu.degree}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="liquid-glass h-full rounded-2xl p-6 md:p-8"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-3">
                        <GraduationCap size={32} weight="duotone" className="shrink-0 text-accent" />
                        <span className="shrink-0 rounded-full border border-accent/25 bg-accent/[0.08] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                          {edu.period}
                        </span>
                      </div>
                      <h3 className="font-sans text-xl font-bold tracking-tight text-white">
                        {edu.degree}
                      </h3>
                      <span className="font-mono text-xs text-zinc-400">{edu.institution}</span>
                      <p className="font-sans text-sm leading-relaxed text-white/65">
                        {edu.description}
                      </p>
                    </div>
                  </motion.article>
                ))}
              </div>

              <div className="flex flex-col gap-6">
                <motion.article
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5 }}
                  className="liquid-glass h-full rounded-2xl p-6 md:p-8 flex flex-col gap-6"
                >
                  <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                    <Trophy size={32} weight="duotone" className="text-accent" />
                    <h3 className="font-sans text-2xl font-bold text-white">Certifications</h3>
                  </div>
                  <ul className="flex flex-col gap-5">
                    {certifications.map((cert) => (
                      <li key={cert.name} className="flex flex-col gap-1">
                        <span className="font-sans text-lg font-semibold text-white/90">
                          {cert.name}
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-widest text-accent/70">
                          {cert.issuer}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.article>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

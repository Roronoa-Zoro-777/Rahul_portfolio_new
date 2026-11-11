"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Navbar } from "@/components/ui/Navbar";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import {
  ChartBar,
  Database,
  Lightning,
  MapPin,
  GraduationCap,
  GameController,
  Books,
  MusicNote,
  Barbell,
  Lightbulb,
  CodeBlock,
} from "@phosphor-icons/react";

const whatIDo = [
  {
    icon: ChartBar,
    title: "Data Analysis",
    description:
      "Turning messy datasets into clean, structured insights using SQL, Python, and statistical methods. I dig deep into numbers to find patterns that matter.",
    tools: ["SQL", "Python", "Pandas", "NumPy"],
  },
  {
    icon: Database,
    title: "Data Visualization",
    description:
      "Building interactive dashboards and visual reports that make complex data easy to understand and act on for stakeholders at every level.",
    tools: ["Power BI", "Tableau", "Excel", "Matplotlib"],
  },
  {
    icon: Lightning,
    title: "Data Engineering",
    description:
      "Designing scalable data pipelines and optimizing database architectures to ensure clean, reliable data flows for analytics workflows.",
    tools: ["PostgreSQL", "AWS", "Spark", "Airflow"],
  },
  {
    icon: Lightbulb,
    title: "Strategic Thinking",
    description:
      "Aligning data initiatives with business goals to ensure every metric tracked directly contributes to overarching company objectives and growth.",
    tools: ["Strategy", "A/B Testing", "KPIs", "Metrics"],
  },
  {
    icon: CodeBlock,
    title: "Automation",
    description:
      "Writing scripts and building workflows to automate repetitive data extraction and reporting tasks, saving hundreds of manual hours.",
    tools: ["Python", "Cron", "Zapier", "Bash"],
  },
];

const interests = [
  { icon: GameController, label: "Gaming" },
  { icon: Books, label: "Reading" },
  { icon: MusicNote, label: "Music" },
  { icon: Barbell, label: "Fitness" },
];

export default function AboutPage() {
  const containerRef = useRef<HTMLElement>(null);

  // Overall page scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 1. Hero Zoom & Fade
  const heroScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  // 2. Profile & Education 3D Rotation
  const profileSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: profileScroll } = useScroll({
    target: profileSectionRef,
    offset: ["start end", "center center"],
  });

  const cardRotateXProfile = useTransform(profileScroll, [0, 1], [45, 0]);
  const cardOpacityProfile = useTransform(profileScroll, [0, 1], [0, 1]);
  const cardScaleProfile = useTransform(profileScroll, [0, 1], [0.8, 1]);

  const cardRotateXEdu = useTransform(profileScroll, [0.2, 1], [45, 0]);
  const cardOpacityEdu = useTransform(profileScroll, [0.2, 1], [0, 1]);
  const cardScaleEdu = useTransform(profileScroll, [0.2, 1], [0.8, 1]);

  // 3. Sticky Horizontal Scroll for "What I Do" (REMOVED)

  // 4. Interests Parallax
  const interestsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: interestsScroll } = useScroll({
    target: interestsRef,
    offset: ["start end", "end start"],
  });
  const i1Y = useTransform(interestsScroll, [0, 1], [80, -80]);
  const i2Y = useTransform(interestsScroll, [0, 1], [150, -150]);
  const i3Y = useTransform(interestsScroll, [0, 1], [40, -40]);
  const i4Y = useTransform(interestsScroll, [0, 1], [120, -120]);
  const interestTransforms = [i1Y, i2Y, i3Y, i4Y];

  return (
    <>
      <Navbar />
      <main id="main-content" ref={containerRef} className="relative bg-background overflow-x-hidden">
        {/* ─── Hero ─── */}
        <section className="page-hero relative flex h-screen flex-col justify-center border-b border-red-300/15 px-6 pb-16 pt-32 md:px-10">
          <motion.div
            className="mx-auto w-full max-w-[1400px] origin-top"
            style={{ scale: heroScale, opacity: heroOpacity }}
          >
            <div className="flex flex-col gap-6">
              <div>
                <EyebrowBadge>PROFILE // ABOUT ME</EyebrowBadge>
              </div>
              <div>
                <h1 className="max-w-[18ch] font-sans text-5xl font-bold leading-[0.95] tracking-tighter text-white md:text-7xl lg:text-8xl">
                  The analyst
                  <br />
                  <span className="text-accent">behind the data.</span>
                </h1>
              </div>
              <div>
                <p className="max-w-[52ch] font-sans text-base leading-relaxed text-zinc-400 md:text-lg">
                  I believe every dataset has a story waiting to be told. My job is to find it,
                  shape it, and present it so it drives real decisions.
                </p>
                <div className="mt-8">
                  <a
                    href="/resume.pdf"
                    download
                    className="inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/20 px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest text-accent backdrop-blur-md transition-all hover:scale-105 hover:bg-accent hover:text-black"
                  >
                    Download Resume
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ─── Profile + Education (3D Folding) ─── */}
        <section
          ref={profileSectionRef}
          className="skills-section relative z-10 border-b border-red-300/15 bg-background px-6 py-16 md:px-10 md:py-32"
          style={{ perspective: "1500px" }}
        >
          <div className="mx-auto max-w-[1400px]">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Profile Card */}
              <motion.article
                style={{
                  rotateX: cardRotateXProfile,
                  opacity: cardOpacityProfile,
                  scale: cardScaleProfile,
                  transformOrigin: "bottom",
                }}
                className="liquid-glass h-full rounded-2xl p-6 md:p-10"
              >
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-4">
                    <span className="inline-block h-16 w-16 rounded-full bg-gradient-to-br from-accent/40 to-accent/10 shadow-[0_0_24px_rgba(212,162,47,0.3)]" />
                    <div>
                      <h2 className="font-sans text-3xl font-bold tracking-tight text-white">
                        Rahul B
                      </h2>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
                        Data Analyst
                      </span>
                    </div>
                  </div>
                  <p className="font-sans text-base leading-relaxed text-white/70 md:text-lg">
                    I&rsquo;m a data analyst based in Bangalore, India, passionate about
                    transforming raw, unstructured data into clean visual reports and actionable
                    insights. Experienced in data modeling, exploratory analysis, and performance
                    tracking to help solve real-world problems.
                  </p>
                  <div className="flex items-center gap-2 font-mono text-sm text-zinc-400">
                    <MapPin size={18} weight="duotone" className="text-[#EF4444]" />
                    <span>Bangalore, Karnataka, India</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["SQL", "Python", "Power BI", "Excel", "Tableau", "Pandas"].map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/75"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>

              {/* Education Card */}
              <motion.article
                style={{
                  rotateX: cardRotateXEdu,
                  opacity: cardOpacityEdu,
                  scale: cardScaleEdu,
                  transformOrigin: "bottom",
                }}
                className="liquid-glass h-full rounded-2xl p-6 md:p-10"
              >
                <div className="flex flex-col gap-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-sans text-3xl font-bold tracking-tight text-white">
                      Education
                    </h3>
                    <GraduationCap size={36} weight="duotone" className="text-accent" />
                  </div>

                  <div className="flex flex-col gap-5">
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                      <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                        2022 — Present
                      </span>
                      <h4 className="mt-2 font-sans text-lg font-semibold text-white">
                        B.Tech in Computer Science
                      </h4>
                      <p className="mt-1 font-sans text-sm text-zinc-400">
                        Focused on data structures, algorithms, databases, and machine learning
                        coursework.
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                      <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                        Certifications
                      </span>
                      <h4 className="mt-2 font-sans text-lg font-semibold text-white">
                        Google Data Analytics Professional Certificate
                      </h4>
                      <p className="mt-1 font-sans text-sm text-zinc-400">
                        8-course specialization covering data cleaning, visualization, R programming,
                        and SQL.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.article>
            </div>
          </div>
        </section>

        {/* ─── What I Do (Grid Layout) ─── */}
        <section className="skills-section border-b border-red-300/15 px-6 py-16 md:px-10 md:py-24 relative z-10 bg-background">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-12 max-w-2xl">
              <EyebrowBadge>CAPABILITIES // WHAT I DO</EyebrowBadge>
              <h2 className="mt-4 font-sans text-4xl font-bold leading-[0.98] tracking-tighter text-foreground md:text-5xl">
                The foundations of my <span className="text-accent">workflow.</span>
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {whatIDo.map((item, index) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                  className="liquid-glass flex h-full flex-col rounded-3xl p-8 transition-transform hover:-translate-y-2"
                >
                  <div className="flex items-start justify-between gap-4">
                    <item.icon size={42} weight="duotone" className="text-accent" />
                    <span className="font-mono text-[14px] uppercase tracking-[0.2em] text-accent/50">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 font-sans text-2xl font-bold tracking-tight text-white">
                    {item.title}
                  </h3>
                  <p className="mt-4 font-sans text-base leading-relaxed text-white/70">
                    {item.description}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-6">
                    {item.tools.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white/75"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Personal Interests (Floating Parallax) ─── */}
        <section
          ref={interestsRef}
          className="skills-section relative overflow-hidden bg-background px-6 py-24 md:px-10 md:py-40"
        >
          <div className="mx-auto max-w-[1400px]">
            <div className="flex flex-col items-center gap-12 text-center">
              <div>
                <EyebrowBadge>OFF DUTY // INTERESTS</EyebrowBadge>
                <h2 className="mt-4 font-sans text-4xl font-bold tracking-tighter text-foreground md:text-5xl">
                  When I&rsquo;m not crunching <span className="text-accent">numbers.</span>
                </h2>
              </div>

              <div className="mt-16 flex w-full max-w-4xl flex-wrap justify-center gap-8 md:gap-16">
                {interests.map((item, i) => {
                  return (
                    <motion.div
                      key={item.label}
                      style={{ y: interestTransforms[i % interestTransforms.length] }}
                      className="liquid-glass flex flex-col items-center gap-5 rounded-[2rem] p-8 transition-all duration-500 hover:scale-110 hover:border-accent/40 hover:bg-white/[0.1]"
                    >
                      <item.icon size={64} weight="duotone" className="text-accent drop-shadow-[0_0_15px_rgba(212,162,47,0.5)]" />
                      <span className="font-mono text-sm font-bold uppercase tracking-[0.16em] text-white/90">
                        {item.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

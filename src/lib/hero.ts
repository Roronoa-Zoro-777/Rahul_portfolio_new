export const FRAME_COUNT = 600;

export const framePath = (n: number) =>
  `/amazing_spiderman/frame-${n}.png`;

export type Dialogue = {
  id: string;
  show: number;
  hide: number;
  quote: string;
  speaker: string;
  film: string;
};

export const DIALOGUES: Dialogue[] = [
  {
    id: "d1",
    show: 0.1,
    hide: 0.3,
    quote: "There is no such thing as truth or lies in this world; there never has been. There are only plain, hard facts.",
    speaker: "RAHUL B",
    film: "2004",
  },
  {
    id: "d2",
    show: 0.35,
    hide: 0.55,
    quote: "SQL • Python • Power BI • Excel",
    speaker: "RAHUL B",
    film: "2004",
  },
  {
    id: "d3",
    show: 0.6,
    hide: 0.8,
    quote: "All your battles took place in the palm of my hands.",
    speaker: "RAHUL B",
    film: "2004",
  },
];

export type AnalystInsight = {
  id: string;
  show: number;
  hide: number;
  headline: string;
  description: string;
};

export const ANALYST_INSIGHTS: AnalystInsight[] = [
  {
    id: "clean",
    show: 0.1,
    hide: 0.2,
    headline: "Start with clean data.",
    description: "Shape raw information into a reliable foundation.",
  },
  {
    id: "profile",
    show: 0.21,
    hide: 0.32,
    headline:
      "I transform raw, unstructured data into clean visual reports and actionable insights.",
    description:
      "Experienced in data modeling, exploratory analysis, and performance tracking to help solve real-world problems.",
  },
  {
    id: "query",
    show: 0.33,
    hide: 0.44,
    headline: "Ask better questions.",
    description: "Use SQL and Python to uncover useful patterns.",
  },
  {
    id: "patterns",
    show: 0.45,
    hide: 0.56,
    headline: "Find the signal.",
    description: "Separate meaningful trends from everyday noise.",
  },
  {
    id: "visualize",
    show: 0.57,
    hide: 0.68,
    headline: "Make insights visible.",
    description: "Build clear dashboards that tell the story.",
  },
  {
    id: "measure",
    show: 0.69,
    hide: 0.8,
    headline: "Measure what matters.",
    description: "Use meaningful metrics to track performance.",
  },
  {
    id: "impact",
    show: 0.81,
    hide: 0.96,
    headline: "Turn insight into action.",
    description: "Help teams make confident, data-informed decisions.",
  },
];

export const HERO_TEXT_FADE_END = 0.08;

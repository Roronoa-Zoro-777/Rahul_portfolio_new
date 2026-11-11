import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  "Skills",
  "Explore Rahul B's data analytics, engineering, visualization, and programming skills.",
  "/skills",
);

export default function SkillsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

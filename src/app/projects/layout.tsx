import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  "Projects",
  "Browse Rahul B's data analytics, visualization, and engineering project portfolio.",
  "/projects",
);

export default function ProjectsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

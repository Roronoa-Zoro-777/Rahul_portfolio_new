import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  "Experience",
  "Review Rahul B's professional experience, education, internships, and certifications.",
  "/experience",
);

export default function ExperienceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

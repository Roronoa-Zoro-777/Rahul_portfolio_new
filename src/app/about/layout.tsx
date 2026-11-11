import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  "About",
  "Meet Rahul B, a data analyst in Bangalore focused on turning complex data into clear, actionable insights.",
  "/about",
);

export default function AboutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

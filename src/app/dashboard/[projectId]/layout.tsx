import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createPageMetadata } from "@/lib/metadata";
import { dashboardConfigs } from "@/lib/dashboardConfig";

export async function generateMetadata({
  params,
}: LayoutProps<"/dashboard/[projectId]">): Promise<Metadata> {
  const { projectId } = await params;
  const config = dashboardConfigs[projectId];

  if (!config) notFound();

  return createPageMetadata(
    `${config.title} Dashboard`,
    `Explore the illustrative ${config.title.toLowerCase()} analytics dashboard.`,
    `/dashboard/${projectId}`,
  );
}

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

import { notFound } from "next/navigation";
import DashboardClient from "./DashboardClient";
import { dashboardConfigs } from "@/lib/dashboardConfig";

export default async function DashboardPage({
  params,
}: PageProps<"/dashboard/[projectId]">) {
  const { projectId } = await params;
  const config = dashboardConfigs[projectId];

  if (!config) notFound();

  return <DashboardClient config={config} />;
}

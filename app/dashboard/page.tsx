import { DashboardPage } from "@/components/dashboard-page";
import { readProfileCookie } from "@/lib/profile-cookie";
import { sampleDashboard } from "@/lib/sample-data";

type DashboardRouteProps = {
  searchParams?: Promise<{
    connected?: string;
    error?: string;
  }>;
};

export default async function DashboardRoute({ searchParams }: DashboardRouteProps) {
  const profile = await readProfileCookie();
  const params = searchParams ? await searchParams : undefined;

  return (
    <DashboardPage
      initialProfile={profile}
      initialDashboard={{ ...sampleDashboard, profile }}
      statusMessage={params?.connected ? `Connected ${params.connected} successfully.` : undefined}
      errorMessage={params?.error ? `Unable to complete ${params.error.replaceAll("_", " ")}.` : undefined}
    />
  );
}

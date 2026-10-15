import React, { Suspense } from "react";
import { getTenantApplications } from "../../_actions/tenantApplications";
import { ApplicationsClient } from "./applications-client";
import { ListRowsSkeleton } from "@/components/dashboard/section-skeletons";

export default function TenantApplicationsPage() {
  return (
    <Suspense fallback={<TenantApplicationsFallback />}>
      <ApplicationsData />
    </Suspense>
  );
}

function TenantApplicationsFallback() {
  return (
    <div className="space-y-8" aria-hidden="true">
      <div className="space-y-2">
        <div className="h-7 w-52 rounded-md bg-muted animate-pulse" />
        <div className="h-4 w-72 rounded-md bg-muted animate-pulse" />
      </div>
      <ListRowsSkeleton rows={3} />
    </div>
  );
}

async function ApplicationsData() {
  const applicationsRes = await getTenantApplications();
  const applications = applicationsRes.data;

  return <ApplicationsClient applications={applications} />;
}


import React, { Suspense } from "react";
import { getTenantLeases } from "../../_actions/tenantLease";
import { getTenantReviews } from "../../_actions/tenantReviews";
import { LeaseClient } from "./lease-client";
import { ListRowsSkeleton } from "@/components/dashboard/section-skeletons";

export default function TenantLeasesPage() {
  return (
    <Suspense fallback={<TenantLeaseFallback />}>
      <LeaseData />
    </Suspense>
  );
}

function TenantLeaseFallback() {
  return (
    <div className="space-y-8" aria-hidden="true">
      <div className="space-y-2">
        <div className="h-7 w-48 rounded-md bg-muted animate-pulse" />
        <div className="h-4 w-72 rounded-md bg-muted animate-pulse" />
      </div>
      <ListRowsSkeleton rows={3} />
    </div>
  );
}

async function LeaseData() {
  const [leasesRes, reviewsRes] = await Promise.all([
    getTenantLeases(),
    getTenantReviews()
  ]);

  const leases = leasesRes.data || [];
  const reviewedLeaseIds = (reviewsRes.data?.written || []).map((r: { leaseId: string }) => r.leaseId);

  return <LeaseClient leases={leases} reviewedLeaseIds={reviewedLeaseIds} />;
}

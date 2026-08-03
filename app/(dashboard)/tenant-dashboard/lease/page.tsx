import React from "react";
import { getTenantLeases } from "../../_actions/tenantLease";
import { getTenantReviews } from "../../_actions/tenantReviews";
import { LeaseClient } from "./lease-client";

export default async function TenantLeasesPage() {
  const [leasesRes, reviewsRes] = await Promise.all([
    getTenantLeases(),
    getTenantReviews()
  ]);
  
  const leases = leasesRes.data || [];
  const reviewedLeaseIds = (reviewsRes.data?.written || []).map((r: any) => r.leaseId);

  return <LeaseClient leases={leases} reviewedLeaseIds={reviewedLeaseIds} />;
}

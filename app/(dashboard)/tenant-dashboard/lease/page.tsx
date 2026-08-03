import React from "react";
import { getTenantLeases } from "../../_actions/tenantLease";
import { LeaseClient } from "./lease-client";

export default async function TenantLeasesPage() {
  const leasesRes = await getTenantLeases();
  const leases = leasesRes.data;

  return <LeaseClient leases={leases} />;
}

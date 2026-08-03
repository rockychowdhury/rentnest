import React from "react";
import { getTenantApplications } from "../../_actions/tenantApplications";
import { ApplicationsClient } from "./applications-client";

export default async function TenantApplicationsPage() {
  const applicationsRes = await getTenantApplications();
  const applications = applicationsRes.data;

  return <ApplicationsClient applications={applications} />;
}


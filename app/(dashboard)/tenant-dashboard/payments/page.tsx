import React from "react";
import { getTenantPayments } from "../../_actions/tenantPayments";
import { PaymentsClient } from "./payments-client";

export default async function TenantPaymentsPage() {
  const paymentsRes = await getTenantPayments();
  const paymentsData = paymentsRes.data;

  return <PaymentsClient paymentsData={paymentsData} />;
}

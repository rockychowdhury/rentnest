import React, { Suspense } from "react";
import { getTenantPayments } from "../../_actions/tenantPayments";
import { PaymentsClient } from "./payments-client";
import { TableCardSkeleton } from "@/components/dashboard/section-skeletons";

export default function TenantPaymentsPage() {
  return (
    <Suspense fallback={<TenantPaymentsFallback />}>
      <PaymentsData />
    </Suspense>
  );
}

function TenantPaymentsFallback() {
  return (
    <div className="space-y-8" aria-hidden="true">
      <div className="space-y-2">
        <div className="h-7 w-40 rounded-md bg-muted animate-pulse" />
        <div className="h-4 w-72 rounded-md bg-muted animate-pulse" />
      </div>
      <TableCardSkeleton rows={5} />
    </div>
  );
}

async function PaymentsData() {
  const paymentsRes = await getTenantPayments();
  const paymentsData = paymentsRes.data;

  return <PaymentsClient paymentsData={paymentsData} />;
}

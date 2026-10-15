import React, { Suspense } from "react";
import { getAccountProfile } from "../../_actions/accountActions";
import { AccountClient } from "../../_components/account/account-client";
import { FormCardSkeleton } from "@/components/dashboard/section-skeletons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account | Landlord Dashboard | RentNest",
};

export default function LandlordAccountPage() {
  return (
    <Suspense fallback={<FormCardSkeleton />}>
      <AccountData />
    </Suspense>
  );
}

async function AccountData() {
  const profileRes = await getAccountProfile();
  const user = profileRes.data;

  return <AccountClient user={user} />;
}

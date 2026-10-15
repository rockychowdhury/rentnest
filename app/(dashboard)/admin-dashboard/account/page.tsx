import React, { Suspense } from "react";
import { getAccountProfile } from "../../_actions/accountActions";
import { AccountClient } from "../../_components/account/account-client";
import { FormCardSkeleton } from "@/components/dashboard/section-skeletons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Account Settings | RentNest",
};

export default function AdminAccountPage() {
  const result = getAccountProfile();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your administrator profile and security preferences.
        </p>
      </div>

      <Suspense fallback={<FormCardSkeleton />}>
        <AccountData promise={result} />
      </Suspense>
    </div>
  );
}

async function AccountData({ promise }: { promise: Promise<Awaited<ReturnType<typeof getAccountProfile>>> }) {
  const result = await promise;
  const profile = result.data;

  return <AccountClient user={profile} />;
}

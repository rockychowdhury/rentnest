import { getAccountProfile } from "../../_actions/accountActions";
import { AccountClient } from "../../_components/account/account-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Account Settings | RentNest",
};

export default async function AdminAccountPage() {
  const result = await getAccountProfile();
  
  const profile = result.data;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your administrator profile and security preferences.
        </p>
      </div>
      
      <AccountClient user={profile} />
    </div>
  );
}

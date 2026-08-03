import React from "react";
import { getAccountProfile } from "../../_actions/accountActions";
import { AccountClient } from "../../_components/account/account-client";

export const metadata = {
  title: "Admin Account Settings | RentNest",
};

export default async function AdminAccountPage() {
  const result = await getAccountProfile();
  
  // The backend might return errors if the user doesn't have a profile yet,
  // or if they are not authenticated.
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

import React from "react";
import { getAccountProfile } from "../../_actions/accountActions";
import { AccountClient } from "../../_components/account/account-client";

export default async function TenantAccountPage() {
  const profileRes = await getAccountProfile();
  const user = profileRes.data;

  return <AccountClient user={user} />;
}


import { getAccountProfile } from "../../_actions/accountActions";
import { AccountClient } from "../../_components/account/account-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account | Landlord Dashboard | RentNest",
};

export default async function LandlordAccountPage() {
  const profileRes = await getAccountProfile();
  const user = profileRes.data;

  return <AccountClient user={user} />;
}

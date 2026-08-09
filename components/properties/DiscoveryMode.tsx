import React from "react";
import { getDiscoveryRails } from "@/service/getDiscoveryRails";
import { PropertyRail } from "./PropertyRail";

import { EmptyProperties } from "./EmptyProperties";

export async function DiscoveryMode() {
  const rails = await getDiscoveryRails();

  if (!rails || rails.length === 0) {
    return <EmptyProperties />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
      {rails.map((rail) => (
        <PropertyRail key={rail.id} rail={rail} />
      ))}
    </div>
  );
}

export default DiscoveryMode;

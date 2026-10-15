import React, { Suspense } from "react";
import { getCategories } from "@/app/(dashboard)/_actions/propertiesActions";
import { PropertyFormWizard } from "@/app/(dashboard)/_components/properties/PropertyFormWizard";
import { FormCardSkeleton } from "@/components/dashboard/section-skeletons";

export default function NewPropertyPage() {
  return (
    <div className="py-6">
      <Suspense fallback={<FormCardSkeleton />}>
        <NewPropertyWizard />
      </Suspense>
    </div>
  );
}

async function NewPropertyWizard() {
  const { data: categories = [] } = await getCategories();

  return <PropertyFormWizard categories={categories} />;
}

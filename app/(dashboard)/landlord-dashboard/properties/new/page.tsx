import { getCategories } from "@/app/(dashboard)/_actions/propertiesActions";
import { PropertyFormWizard } from "@/app/(dashboard)/_components/properties/PropertyFormWizard";

export default async function NewPropertyPage() {
  const { data: categories = [] } = await getCategories();

  return (
    <div className="py-6">
      <PropertyFormWizard categories={categories} />
    </div>
  );
}

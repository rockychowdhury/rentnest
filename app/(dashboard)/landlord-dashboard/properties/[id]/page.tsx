import { getPropertyById } from "@/app/(dashboard)/_actions/propertiesActions";
import { notFound, redirect } from "next/navigation";

export default async function PropertyIdRedirectPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { data: property, success } = await getPropertyById(params.id);

  if (!success || !property) {
    return <div className="p-8 text-red-500">Property not found by API in [id]/page.tsx. ID: {params.id}. Please check your backend connection.</div>;
  }

  // Redirect to the default 'details' tab with the correct slug
  redirect(`/landlord-dashboard/properties/${property.id}/${property.slug}/details`);
}

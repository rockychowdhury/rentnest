import { getPropertyById } from "@/app/(dashboard)/_actions/propertiesActions";
import { notFound, redirect } from "next/navigation";

export default async function PropertyIdRedirectPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { data: property, success } = await getPropertyById(params.id);

  if (!success || !property) {
    notFound();
  }

  // Redirect to the default 'details' tab with the correct slug
  redirect(`/landlord-dashboard/properties/${property.id}/${property.slug}/details`);
}

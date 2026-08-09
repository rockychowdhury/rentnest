import { getPropertyById } from "@/app/(dashboard)/_actions/propertiesActions";
import { notFound, redirect } from "next/navigation";
import { PropertyStatus } from "@/types";

export default async function PublicPropertyIdRedirectPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { data: property, success } = await getPropertyById(params.id);

  if (!success || !property || property.status !== PropertyStatus.ACTIVE) {
    notFound();
  }

  // Redirect to the URL with the SEO slug
  redirect(`/properties/${property.id}/${property.slug}`);
}

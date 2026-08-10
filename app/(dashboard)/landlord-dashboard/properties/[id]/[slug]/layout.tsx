import { getPropertyById } from "@/app/(dashboard)/_actions/propertiesActions";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, MapPin, Layers, Image as ImageIcon, CheckSquare } from "lucide-react";
import { PropertyStatusBadge } from "@/app/(dashboard)/_components/properties/PropertyStatusBadge";
import { ArchivedIndicator } from "@/app/(dashboard)/_components/properties/ArchivedIndicator";
import { PropertyProvider } from "@/app/(dashboard)/_components/properties/PropertyProvider";

export default async function PropertyHubLayout(props: {
  children: React.ReactNode;
  params: Promise<{ id: string, slug: string }>;
}) {
  const params = await props.params;
  console.log("LAYOUT PARAMS:", params);
  const { data: property, success } = await getPropertyById(params.id);
  console.log("LAYOUT PROPERTY SUCCESS:", success, !!property);

  if (!success || !property) {
    console.error("NOT FOUND IN LAYOUT FOR ID:", params.id);
    return <div className="p-8 text-red-500">Property not found by API in layout.tsx. ID: {params.id}. Please check your backend connection.</div>;
  }
  
  const isArchived = !!property.deletedAt;

  const navItems = [
    { label: "Details", href: `/landlord-dashboard/properties/${params.id}/${params.slug}/details`, icon: <Building2 className="h-4 w-4" /> },
    { label: "Address", href: `/landlord-dashboard/properties/${params.id}/${params.slug}/address`, icon: <MapPin className="h-4 w-4" /> },
    { label: "Units", href: `/landlord-dashboard/properties/${params.id}/${params.slug}/units`, icon: <Layers className="h-4 w-4" /> },
    { label: "Images", href: `/landlord-dashboard/properties/${params.id}/${params.slug}/images`, icon: <ImageIcon className="h-4 w-4" /> },
    { label: "Amenities", href: `/landlord-dashboard/properties/${params.id}/${params.slug}/amenities`, icon: <CheckSquare className="h-4 w-4" /> },
  ];

  return (
    <div className="flex flex-col space-y-8 pb-10">
      <div className="flex items-center gap-4 border-b pb-4">
        <Link href="/landlord-dashboard/properties" className="p-2 hover:bg-muted rounded-md transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{property.title}</h1>
            {isArchived ? <ArchivedIndicator /> : <PropertyStatusBadge status={property.status} />}
          </div>
          <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
            <MapPin className="h-3 w-3" />
            {property.address?.streetAddress || "Address not set"}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <aside className="md:w-48 lg:w-56 shrink-0">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted hover:text-foreground text-muted-foreground whitespace-nowrap transition-colors"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1">
          <PropertyProvider initialProperty={property as any}>
            {props.children}
          </PropertyProvider>
        </main>
      </div>
    </div>
  );
}

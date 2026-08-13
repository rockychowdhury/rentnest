"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Home } from "lucide-react";
import { Property, PropertyStatus } from "@/types";
import { getMyProperties, archiveProperty, restoreProperty, requestPropertyVerification, deactivateProperty } from "@/app/(dashboard)/_actions/propertiesActions";
import { PropertyManageCard } from "@/app/(dashboard)/_components/properties/PropertyManageCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function PropertiesListPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProperties = async (silent = false) => {
    if (!silent) setIsLoading(true);
    const res = await getMyProperties();
    if (res.success) {
      setProperties(res.data);
    } else {
      toast.error(res.error || "Failed to load properties");
    }
    if (!silent) setIsLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleRequestVerification = async (id: string) => {
    const res = await requestPropertyVerification(id);
    if (res.success) {
      toast.success(res.message || "Verification requested successfully");
      fetchProperties(true);
    } else {
      toast.error(res.error || "Failed to request verification");
    }
  };

  const handleDeactivate = async (id: string) => {
    const res = await deactivateProperty(id);
    if (res.success) {
      toast.success(res.message || "Property deactivated successfully");
      fetchProperties(true);
    } else {
      toast.error(res.error || "Failed to deactivate property");
    }
  };

  const handleArchive = async (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id)); // Optimistic UI update
    const res = await archiveProperty(id);
    if (res.success) {
      toast.success("Property deleted successfully");
      fetchProperties(true);
    } else {
      toast.error(res.error || "Failed to delete property");
      fetchProperties(true); // Re-fetch on failure to sync
    }
  };

  const handleRestore = async (id: string) => {
    const res = await restoreProperty(id);
    if (res.success) {
      toast.success(res.message || "Property restored");
      fetchProperties(true);
    } else {
      toast.error(res.error || "Failed to restore property");
    }
  };

  const renderPropertyList = (filteredProps: Property[]) => {
    if (filteredProps.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-lg bg-muted/10">
          <Home className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No properties found</h3>
          <p className="text-muted-foreground text-center max-w-sm mb-6">
            There are no properties matching this filter.
          </p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProps.map((property) => (
          <PropertyManageCard
            key={property.id}
            property={property}
            onArchive={handleArchive}
            onRestore={handleRestore}
            onRequestVerification={handleRequestVerification}
            onDeactivate={handleDeactivate}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 border rounded-lg bg-card shadow-sm text-center">
        <div className="bg-primary/10 p-4 rounded-full mb-6">
          <Home className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">You haven't listed a property yet</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          Create your first property listing to start receiving inquiries and managing tenants.
        </p>
        <Link href="/landlord-dashboard/properties/new" className={`bg-primary hover:bg-primary-hover ${buttonVariants({ variant: "default" })}`}>
          <Plus className="mr-2 h-4 w-4" />
          Create your first listing
        </Link>
      </div>
    );
  }

  const activeProperties = properties.filter((p) => !p.deletedAt);
  
  const draftProperties = activeProperties.filter((p) => p.status === PropertyStatus.DRAFT);
  const activeStatusProperties = activeProperties.filter((p) => p.status === PropertyStatus.ACTIVE);
  const inactiveProperties = activeProperties.filter((p) => p.status === PropertyStatus.INACTIVE);
  const pendingProperties = activeProperties.filter((p) => p.status === PropertyStatus.PENDING_VERIFICATION);
  const rejectedProperties = activeProperties.filter((p) => p.status === PropertyStatus.REJECTED);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">Manage your property portfolio and listings.</p>
        </div>
        <Link href="/landlord-dashboard/properties/new" className={`bg-primary hover:bg-primary-hover ${buttonVariants({ variant: "default" })}`}>
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Link>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4 flex overflow-x-auto max-w-full justify-start h-auto p-1 gap-1">
          <TabsTrigger value="all" className="text-xs sm:text-sm shrink-0">All ({activeProperties.length})</TabsTrigger>
          <TabsTrigger value="active" className="text-xs sm:text-sm shrink-0">Active ({activeStatusProperties.length})</TabsTrigger>
          <TabsTrigger value="pending" className="text-xs sm:text-sm shrink-0">Pending ({pendingProperties.length})</TabsTrigger>
          <TabsTrigger value="draft" className="text-xs sm:text-sm shrink-0">Drafts ({draftProperties.length})</TabsTrigger>
          <TabsTrigger value="inactive" className="text-xs sm:text-sm shrink-0">Inactive ({inactiveProperties.length})</TabsTrigger>
          <TabsTrigger value="rejected" className="text-xs sm:text-sm shrink-0">Rejected ({rejectedProperties.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {renderPropertyList(activeProperties)}
        </TabsContent>
        <TabsContent value="active" className="mt-0">
          {renderPropertyList(activeStatusProperties)}
        </TabsContent>
        <TabsContent value="pending" className="mt-0">
          {renderPropertyList(pendingProperties)}
        </TabsContent>
        <TabsContent value="draft" className="mt-0">
          {renderPropertyList(draftProperties)}
        </TabsContent>
        <TabsContent value="inactive" className="mt-0">
          {renderPropertyList(inactiveProperties)}
        </TabsContent>
        <TabsContent value="rejected" className="mt-0">
          {renderPropertyList(rejectedProperties)}
        </TabsContent>
      </Tabs>
    </div>
  );
}

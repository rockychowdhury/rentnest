"use client";

import { useEffect, useState, use } from "react";
import { Property, PropertyStatus, Category } from "@/types";
import { updateProperty, archiveProperty, restoreProperty, getCategories, requestPropertyVerification, deactivateProperty } from "@/app/(dashboard)/_actions/propertiesActions";
import { DangerZone } from "@/app/(dashboard)/_components/properties/DangerZone";
import { PropertyStatusBadge } from "@/app/(dashboard)/_components/properties/PropertyStatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

import { usePropertyContext } from "@/app/(dashboard)/_components/properties/PropertyProvider";
import { useRouter } from "next/navigation";

export default function PropertyDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const { property, setProperty } = usePropertyContext();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isStatusChanging, setIsStatusChanging] = useState(false);

  const [formData, setFormData] = useState({
    title: property.title || "",
    description: property.description || "",
    categoryId: property.categoryId || "",
  });

  const loadCategories = async () => {
    setIsLoadingCategories(true);
    const catRes = await getCategories();
    if (catRes.success) setCategories(catRes.data);
    setIsLoadingCategories(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Sync form data if context property changes externally
  useEffect(() => {
    setFormData({
      title: property.title || "",
      description: property.description || "",
      categoryId: property.categoryId || "",
    });
  }, [property.id]);

  const handleSaveDetails = async () => {
    setIsSaving(true);
    const res = await updateProperty(params.id, formData);
    if (res.success) {
      toast.success("Details updated successfully");
      setProperty(res.data!);
    } else {
      toast.error(res.error || "Failed to update details");
    }
    setIsSaving(false);
  };

  const handleRequestVerification = async () => {
    setIsStatusChanging(true);
    const res = await requestPropertyVerification(params.id);
    if (res.success) {
      toast.success(res.message || "Verification requested successfully");
      router.refresh();
    } else {
      toast.error(res.error || "Failed to request verification");
    }
    setIsStatusChanging(false);
  };

  const handleDeactivate = async () => {
    setIsStatusChanging(true);
    const res = await deactivateProperty(params.id);
    if (res.success) {
      toast.success(res.message || "Property deactivated");
      router.refresh();
    } else {
      toast.error(res.error || "Failed to deactivate property");
    }
    setIsStatusChanging(false);
  };

  const handleRestoreListing = async () => {
    setIsStatusChanging(true);
    const res = await restoreProperty(params.id);
    if (res.success) {
      toast.success(res.message || "Property restored");
      router.refresh();
    } else {
      toast.error(res.error || "Failed to restore property");
    }
    setIsStatusChanging(false);
  };

  const handleArchive = async () => {
    const res = await archiveProperty(params.id);
    if (res.success) {
      toast.success("Property archived");
      router.refresh();
    }
  };

  const handleRestore = async () => {
    const res = await restoreProperty(params.id);
    if (res.success) {
      toast.success("Property restored");
      router.refresh();
    }
  };

  if (!property) return null;

  const isArchived = !!property.deletedAt;

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Basic Details</CardTitle>
          </div>
          <CardDescription>Update the core information about this property.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Property Title</Label>
            <Input 
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={isArchived}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={formData.categoryId} 
              onValueChange={(val) => setFormData({ ...formData, categoryId: val as string })}
              disabled={isArchived}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a property category">
                  {formData.categoryId ? categories.find(c => c.id === formData.categoryId)?.name : "Select a property category"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              className="min-h-[120px] resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isArchived}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSaveDetails} disabled={isSaving || isArchived} className="bg-primary hover:bg-primary-hover">
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>

      {!isArchived && (
        <Card>
          <CardHeader>
            <CardTitle>Property Status</CardTitle>
            <CardDescription>Control the visibility of this property to the public.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg bg-muted/20">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-sm">Current Status:</h4>
                  <PropertyStatusBadge status={property.status} />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {property.status === PropertyStatus.DRAFT && "Draft properties are incomplete and not visible. Request verification to publish."}
                  {property.status === PropertyStatus.REJECTED && "Your property was rejected by the admin. Make changes and request verification again."}
                  {property.status === PropertyStatus.PENDING_VERIFICATION && "Your property is currently pending verification by an admin."}
                  {property.status === PropertyStatus.ACTIVE && "Your property is published and visible to the public."}
                  {property.status === PropertyStatus.INACTIVE && "Your property is temporarily hidden from the public. Restore it to make it visible again."}
                </p>
              </div>
              <div className="shrink-0 flex items-center">
                {(property.status === PropertyStatus.DRAFT || property.status === PropertyStatus.REJECTED) && (
                  <Button 
                    onClick={handleRequestVerification} 
                    disabled={isStatusChanging}
                    className="w-full sm:w-auto"
                  >
                    {isStatusChanging ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Request Verification
                  </Button>
                )}
                {property.status === PropertyStatus.ACTIVE && property.isVerified && (
                  <Button 
                    variant="secondary"
                    onClick={handleDeactivate} 
                    disabled={isStatusChanging}
                    className="w-full sm:w-auto"
                  >
                    {isStatusChanging ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Make Inactive
                  </Button>
                )}
                {property.status === PropertyStatus.INACTIVE && property.isVerified && (
                  <Button 
                    variant="default"
                    onClick={handleRestoreListing} 
                    disabled={isStatusChanging}
                    className="w-full sm:w-auto"
                  >
                    {isStatusChanging ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Restore Listing
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <DangerZone 
        isArchived={isArchived}
        onArchive={handleArchive}
        onRestore={handleRestore}
      />
    </div>
  );
}

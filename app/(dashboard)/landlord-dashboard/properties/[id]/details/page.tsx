"use client";

import { useEffect, useState, use } from "react";
import { Property, PropertyStatus, Category } from "@/types";
import { getPropertyById, updateProperty, updatePropertyStatus, archiveProperty, restoreProperty, getCategories } from "@/app/(dashboard)/_actions/propertiesActions";
import { DangerZone } from "@/app/(dashboard)/_components/properties/DangerZone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const [property, setProperty] = useState<Property | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isStatusChanging, setIsStatusChanging] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
  });

  const loadData = async () => {
    setIsLoading(true);
    const [propRes, catRes] = await Promise.all([
      getPropertyById(params.id),
      getCategories()
    ]);
    
    if (catRes.success) setCategories(catRes.data);
    if (propRes.success && propRes.data) {
      setProperty(propRes.data);
      setFormData({
        title: propRes.data.title || "",
        description: propRes.data.description || "",
        categoryId: propRes.data.categoryId || "",
      });
    } else {
      toast.error("Failed to load property details");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [params.id]);

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

  const handleStatusChange = async (status: PropertyStatus) => {
    setIsStatusChanging(true);
    const res = await updatePropertyStatus(params.id, status);
    if (res.success) {
      toast.success(`Status changed to ${status}`);
      setProperty(res.data!);
    } else {
      toast.error(res.error || "Failed to change status");
    }
    setIsStatusChanging(false);
  };

  const handleArchive = async () => {
    const res = await archiveProperty(params.id);
    if (res.success) {
      toast.success("Property archived");
      loadData(); // reload to get the deletedAt date
    }
  };

  const handleRestore = async () => {
    const res = await restoreProperty(params.id);
    if (res.success) {
      toast.success("Property restored");
      loadData();
    }
  };

  if (isLoading) {
    return <Skeleton className="h-[600px] w-full rounded-lg" />;
  }

  if (!property) return null;

  const isArchived = !!property.deletedAt;

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      <Card>
        <CardHeader>
          <CardTitle>Basic Details</CardTitle>
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
                <h4 className="font-medium text-sm">Current Status: {property.status}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Draft properties are not visible. Published properties are live. Inactive properties are temporarily hidden.
                </p>
              </div>
              <div className="shrink-0 flex items-center">
                <Select 
                  value={property.status} 
                  onValueChange={(val) => handleStatusChange(val as PropertyStatus)}
                  disabled={isStatusChanging}
                >
                  <SelectTrigger className={`w-[180px] font-semibold ${
                    property.status === PropertyStatus.PUBLISHED ? 'bg-success/10 text-success border-success/20' :
                    property.status === PropertyStatus.DRAFT ? 'bg-warning/10 text-warning-foreground border-warning/20' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    <SelectValue placeholder="Status">
                      {property.status === PropertyStatus.DRAFT ? "Draft" :
                       property.status === PropertyStatus.PUBLISHED ? "Published" :
                       property.status === PropertyStatus.INACTIVE ? "Inactive" : "Status"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PropertyStatus.DRAFT} className="text-warning-foreground font-medium">Draft</SelectItem>
                    <SelectItem value={PropertyStatus.PUBLISHED} className="text-success font-medium">Published</SelectItem>
                    <SelectItem value={PropertyStatus.INACTIVE} className="text-muted-foreground font-medium">Inactive</SelectItem>
                  </SelectContent>
                </Select>
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

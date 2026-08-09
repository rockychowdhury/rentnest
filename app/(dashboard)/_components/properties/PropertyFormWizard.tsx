"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Property, PropertyStatus, Category } from "@/types";
import { createProperty, updateProperty, updatePropertyStatus } from "@/app/(dashboard)/_actions/propertiesActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ChevronRight, ChevronLeft, Save, CheckCircle2 } from "lucide-react";

import { propertyWizardSchema } from "@/lib/validators/forms.validator";

interface PropertyFormWizardProps {
  categories: Category[];
}

export function PropertyFormWizard({ categories }: PropertyFormWizardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryId: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = propertyWizardSchema.safeParse(formData);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Validation failed";
      toast.error(firstError);
      return;
    }

    setIsLoading(true);
    try {
      const res = await createProperty({
        ...validation.data,
      });

      if (res.success && res.data) {
        toast.success("Draft created! Redirecting to add details...");
        router.push(`/landlord-dashboard/properties/${res.data.id}/${res.data.slug}/address`);
      } else {
        toast.error(res.error || "Failed to create property");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Add New Property</h1>
        <p className="text-muted-foreground">Start by providing basic information. You can add units, photos, and address in the next steps.</p>
      </div>

      <div className="border rounded-lg p-6 bg-card shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Property Title <span className="text-destructive">*</span></Label>
            <Input 
              id="title"
              placeholder="e.g. Sunset Apartments" 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category <span className="text-destructive">*</span></Label>
            <Select 
              value={formData.categoryId} 
              onValueChange={(val) => setFormData({ ...formData, categoryId: val as string })}
              required
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
              placeholder="Describe the overall property..." 
              className="min-h-[120px] resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="pt-4 flex items-center justify-between border-t">
            <p className="text-sm text-muted-foreground">
              Your progress will be saved as a draft.
            </p>
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary-hover">
              {isLoading ? "Saving Draft..." : "Continue to Address"} 
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

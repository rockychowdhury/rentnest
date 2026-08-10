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
import { ChevronRight, ChevronLeft, Save, CheckCircle2, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils/shadcnUtils";

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
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");

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

          <div className="space-y-2 flex flex-col">
            <Label htmlFor="category">Category <span className="text-destructive">*</span></Label>
            <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
              <PopoverTrigger render={
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={categoryOpen}
                  className={cn(
                    "w-full justify-between font-normal",
                    !formData.categoryId && "text-muted-foreground"
                  )}
                >
                  {formData.categoryId
                    ? categories.find((c) => c.id === formData.categoryId)?.name
                    : "Select a property category"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              } />
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command shouldFilter={false}>
                  <CommandInput 
                    placeholder="Search category..." 
                    value={categorySearch}
                    onValueChange={setCategorySearch}
                  />
                  <CommandList>
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup>
                      {(categorySearch 
                        ? categories.filter(c => c.name.toLowerCase().includes(categorySearch.toLowerCase()))
                        : categories.slice(0, 5)
                      ).map((cat) => (
                        <CommandItem
                          key={cat.id}
                          value={cat.id}
                          onSelect={() => {
                            setFormData({ ...formData, categoryId: cat.id });
                            setCategoryOpen(false);
                            setCategorySearch("");
                          }}
                        >
                          <CheckCircle2
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.categoryId === cat.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {cat.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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

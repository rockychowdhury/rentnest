"use client";

import React, { useEffect, useState } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../_actions/adminActions";
import { categorySchema } from "@/lib/validators/forms.validator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const result = await getCategories();
      const categoriesArray = Array.isArray(result.data) ? result.data : (result.data?.data || []);
      setCategories(categoriesArray);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = categorySchema.safeParse({ name: newCategoryName });
    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message || "Validation failed");
      return;
    }

    setIsCreating(true);
    const res = await createCategory(validation.data.name);
    setIsCreating(false);
    if (res.success) {
      toast.success("Category created");
      setNewCategoryName("");
      fetchCategories();
    } else {
      toast.error(res.error || "Failed to create category");
    }
  };

  const handleUpdate = async (id: string) => {
    const validation = categorySchema.safeParse({ name: editName });
    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message || "Validation failed");
      return;
    }

    const res = await updateCategory(id, validation.data.name);
    if (res.success) {
      toast.success("Category updated");
      setEditingId(null);
      fetchCategories();
    } else {
      toast.error(res.error || "Failed to update category");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;
    const res = await deleteCategory(id, name);
    if (res.success) {
      toast.success("Category deleted");
      fetchCategories();
    } else {
      toast.error(res.error || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground mt-2">
            Manage property categories (e.g., Apartment, House).
          </p>
        </div>
        <form onSubmit={handleCreate} className="flex gap-2 w-full sm:w-auto">
          <Input 
            placeholder="New Category Name" 
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            disabled={isCreating}
            className="w-full sm:w-48"
          />
          <Button type="submit" disabled={isCreating || !newCategoryName.trim()}>
            {isCreating ? "Adding..." : "Add"}
          </Button>
        </form>
      </div>

      <Card className="border-border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No categories found.</div>
          ) : (
            <div className="overflow-x-auto w-full">
              <Table className="min-w-[400px] sm:min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell>
                      {editingId === cat.id ? (
                        <div className="flex gap-2 items-center">
                          <Input 
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-8 max-w-[200px]"
                            autoFocus
                          />
                          <Button size="sm" onClick={() => handleUpdate(cat.id)}>Save</Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                        </div>
                      ) : (
                        <span className="font-medium">{cat.name}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {!editingId && (
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground outline-none">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Name
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(cat.id, cat.name)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

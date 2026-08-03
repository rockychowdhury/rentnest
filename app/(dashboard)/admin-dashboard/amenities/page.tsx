"use client";

import React, { useEffect, useState } from "react";
import { getAmenities, createAmenity, updateAmenity, deleteAmenity } from "../../_actions/adminActions";
import { amenitySchema } from "@/lib/validators/forms.validator";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { CustomPagination } from "@/components/shared/pagination";

export default function AdminAmenitiesPage() {
  const [amenities, setAmenities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const [newAmenityName, setNewAmenityName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");

  const fetchAmenities = async () => {
    setLoading(true);
    try {
      const result = await getAmenities();
      const amenitiesArray = Array.isArray(result.data) ? result.data : (result.data?.data || []);
      setAmenities(amenitiesArray);
    } catch (error) {
      toast.error("Failed to load amenities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = amenitySchema.safeParse({ name: newAmenityName });
    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message || "Validation failed");
      return;
    }

    setIsCreating(true);
    const res = await createAmenity(validation.data.name);
    setIsCreating(false);
    if (res.success) {
      toast.success("Amenity created");
      setNewAmenityName("");
      fetchAmenities();
    } else {
      toast.error(res.error || "Failed to create amenity");
    }
  };

  const handleUpdate = async (id: string) => {
    const validation = amenitySchema.safeParse({ name: editName });
    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message || "Validation failed");
      return;
    }

    const res = await updateAmenity(id, validation.data.name);
    if (res.success) {
      toast.success("Amenity updated");
      setEditingId(null);
      fetchAmenities();
    } else {
      toast.error(res.error || "Failed to update amenity");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const res = await deleteAmenity(deleteId, deleteName);
    if (res.success) {
      toast.success("Amenity deleted");
      fetchAmenities();
    } else {
      toast.error(res.error || "Failed to delete amenity");
    }
    setDeleteId(null);
    setDeleteName("");
  };

  const filteredAmenities = amenities.filter(a => a.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));
  const paginatedAmenities = filteredAmenities.slice((page - 1) * limit, page * limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Amenities</h1>
          <p className="text-muted-foreground mt-2">
            Manage property amenities globally.
          </p>
        </div>
        <form onSubmit={handleCreate} className="flex gap-2 w-full sm:w-auto">
          <Input 
            placeholder="New Amenity Name" 
            value={newAmenityName}
            onChange={(e) => setNewAmenityName(e.target.value)}
            disabled={isCreating}
            className="w-full sm:w-48"
          />
          <Button type="submit" disabled={isCreating || !newAmenityName.trim()}>
            {isCreating ? "Adding..." : "Add"}
          </Button>
        </form>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search amenities..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1); // Reset to first page on search
            }}
          />
        </div>
      </div>

      <Card className="border-border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4">
              <TableSkeleton columns={2} rows={5} />
            </div>
          ) : filteredAmenities.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {searchQuery ? "No amenities found matching your search." : "No amenities found."}
            </div>
          ) : (
            <div className="overflow-x-auto w-full p-4 space-y-4">
              <Table className="min-w-[400px] sm:min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Amenity Name</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAmenities.map((amenity) => (
                    <TableRow key={amenity.id}>
                      <TableCell>
                        {editingId === amenity.id ? (
                          <div className="flex gap-2 items-center">
                            <Input 
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="h-8 max-w-[200px]"
                              autoFocus
                            />
                            <Button size="sm" onClick={() => handleUpdate(amenity.id)}>Save</Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                          </div>
                        ) : (
                          <span className="font-medium">{amenity.name}</span>
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
                              <DropdownMenuItem onClick={() => { setEditingId(amenity.id); setEditName(amenity.name); }}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Name
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive" 
                                onClick={() => {
                                  setDeleteId(amenity.id);
                                  setDeleteName(amenity.name);
                                }}
                              >
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
              
              <CustomPagination
                meta={{ page, limit, total: filteredAmenities.length }}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => {
          setDeleteId(null);
          setDeleteName("");
        }}
        onConfirm={handleDelete}
        title="Delete Amenity"
        description={`Are you sure you want to delete "${deleteName}"? This action cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
}

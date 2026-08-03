"use client";

import React, { useEffect, useState } from "react";
import { getAllProperties, adminDeleteProperty, adminRestoreProperty, adminUpdatePropertyStatus } from "../../_actions/adminActions";
import { Property, PropertyStatus } from "@/types";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ExternalLink, Trash2, RotateCcw, Activity, Search } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { CustomPagination } from "@/components/shared/pagination";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [page, setPage] = useState(1);
  const limit = 10;

  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; type: "delete" | "restore" | null; id: string | null; title: string }>({
    isOpen: false,
    type: null,
    id: null,
    title: ""
  });

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const result = await getAllProperties();
      const propertiesArray = Array.isArray(result.data) ? result.data : (result.data?.data || []);
      setProperties(propertiesArray);
    } catch (error) {
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleUpdateStatus = async (id: string, status: PropertyStatus) => {
    const res = await adminUpdatePropertyStatus(id, status);
    if (res.success) {
      toast.success(`Property marked as ${status}`);
      fetchProperties();
    } else {
      toast.error(res.error || "Failed to update status");
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.id) return;

    if (confirmModal.type === "delete") {
      const res = await adminDeleteProperty(confirmModal.id);
      if (res.success) {
        toast.success("Property deleted");
        fetchProperties();
      } else {
        toast.error(res.error || "Failed to delete property");
      }
    } else if (confirmModal.type === "restore") {
      const res = await adminRestoreProperty(confirmModal.id);
      if (res.success) {
        toast.success("Property restored");
        fetchProperties();
      } else {
        toast.error(res.error || "Failed to restore property");
      }
    }
    
    setConfirmModal({ isOpen: false, type: null, id: null, title: "" });
  };

  const filteredProperties = properties.filter((prop) => {
    const matchesSearch = 
      prop.title?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) || 
      prop.address?.upazila?.district?.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      prop.address?.upazila?.district?.division?.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === "ALL" 
      ? true 
      : statusFilter === "DELETED" 
        ? !!prop.deletedAt 
        : prop.status === statusFilter && !prop.deletedAt;

    return matchesSearch && matchesStatus;
  });

  const paginatedProperties = filteredProperties.slice((page - 1) * limit, page * limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground mt-2">
            Manage all properties across the platform.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by title or location..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select 
          value={statusFilter} 
          onValueChange={(val) => {
            setStatusFilter(val || "ALL");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="DELETED">Deleted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4">
              <TableSkeleton columns={6} rows={5} />
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {searchQuery || statusFilter !== "ALL" ? "No properties found matching your filters." : "No properties found."}
            </div>
          ) : (
            <div className="overflow-x-auto w-full p-4 space-y-4">
              <Table className="min-w-[800px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Landlord</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProperties.map((property) => (
                    <TableRow key={property.id} className={property.deletedAt ? "opacity-60 bg-muted/50" : ""}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {property.title}
                      </TableCell>
                      <TableCell>
                        {property.landlord?.profile?.fullName || property.landlord?.email || "Unknown"}
                      </TableCell>
                      <TableCell>
                        {property.address?.upazila?.district?.name}, {property.address?.upazila?.district?.division?.name}
                      </TableCell>
                      <TableCell>
                        {property.createdAt ? format(new Date(property.createdAt), "MMM dd, yyyy") : "-"}
                      </TableCell>
                      <TableCell>
                        {property.deletedAt ? (
                          <Badge variant="destructive">Deleted</Badge>
                        ) : (
                          <Badge variant={property.status === PropertyStatus.PUBLISHED ? "default" : "secondary"}>
                            {property.status}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground outline-none">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <Link href={`/properties/${property.id}`} target="_blank" className="flex items-center w-full cursor-pointer relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                            
                            {!property.deletedAt && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleUpdateStatus(property.id, PropertyStatus.PUBLISHED)}>
                                  <Activity className="mr-2 h-4 w-4" />
                                  Mark Published
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateStatus(property.id, PropertyStatus.INACTIVE)}>
                                  <Activity className="mr-2 h-4 w-4" />
                                  Mark Inactive
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive focus:text-destructive" 
                                  onClick={() => setConfirmModal({ isOpen: true, type: "delete", id: property.id, title: property.title || "Property" })}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </>
                            )}

                            {property.deletedAt && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setConfirmModal({ isOpen: true, type: "restore", id: property.id, title: property.title || "Property" })}>
                                  <RotateCcw className="mr-2 h-4 w-4" />
                                  Restore
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <CustomPagination
                meta={{ page, limit, total: filteredProperties.length }}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={handleConfirmAction}
        title={confirmModal.type === "delete" ? "Delete Property" : "Restore Property"}
        description={confirmModal.type === "delete" 
          ? `Are you sure you want to delete "${confirmModal.title}"?`
          : `Are you sure you want to restore "${confirmModal.title}"?`}
        confirmText={confirmModal.type === "delete" ? "Delete" : "Restore"}
        isDestructive={confirmModal.type === "delete"}
      />
    </div>
  );
}

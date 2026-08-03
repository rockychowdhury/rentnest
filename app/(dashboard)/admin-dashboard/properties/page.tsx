"use client";

import React, { useEffect, useState } from "react";
import { getAllProperties, adminDeleteProperty, adminRestoreProperty, adminUpdatePropertyStatus } from "../../_actions/adminActions";
import { Property, PropertyStatus } from "@/types";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ExternalLink, Trash2, RotateCcw, Activity } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

import { CustomPagination } from "@/components/shared/pagination";

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10;

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

  const handleDelete = async (id: string) => {
    const res = await adminDeleteProperty(id);
    if (res.success) {
      toast.success("Property deleted");
      fetchProperties();
    } else {
      toast.error(res.error || "Failed to delete property");
    }
  };

  const handleRestore = async (id: string) => {
    const res = await adminRestoreProperty(id);
    if (res.success) {
      toast.success("Property restored");
      fetchProperties();
    } else {
      toast.error(res.error || "Failed to restore property");
    }
  };

  const paginatedProperties = properties.slice((page - 1) * limit, page * limit);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
        <p className="text-muted-foreground mt-2">
          Manage all properties across the platform.
        </p>
      </div>

      <Card className="border-none shadow-md overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading properties...</div>
          ) : properties.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No properties found.</div>
          ) : (
            <div className="p-4 space-y-4">
              <Table>
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
                      <TableCell className="font-medium">
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
                            <DropdownMenuItem>
                              <Link href={`/properties/${property.id}`} target="_blank" className="flex items-center w-full">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            
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
                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(property.id)}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </>
                            )}

                            {property.deletedAt && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleRestore(property.id)}>
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
                meta={{ page, limit, total: properties.length }}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

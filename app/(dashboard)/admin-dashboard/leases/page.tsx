"use client";

import React, { useEffect, useState } from "react";
import { getAllLeases, adminUpdateLeaseStatus } from "../../_actions/adminActions";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, CheckCircle2, AlertOctagon, Clock } from "lucide-react";
import { toast } from "sonner";

export default function AdminLeasesPage() {
  const [leases, setLeases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeases = async () => {
    setLoading(true);
    try {
      const result = await getAllLeases();
      const leasesArray = Array.isArray(result.data) ? result.data : (result.data?.data || []);
      setLeases(leasesArray);
    } catch (error) {
      toast.error("Failed to load leases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeases();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    const res = await adminUpdateLeaseStatus(id, status);
    if (res.success) {
      toast.success(`Lease status updated to ${status}`);
      fetchLeases();
    } else {
      toast.error(res.error || "Failed to update lease status");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leases</h1>
        <p className="text-muted-foreground mt-2">
          Global view of all active and past leases.
        </p>
      </div>

      <Card className="border-border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading leases...</div>
          ) : leases.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>No leases found in the system.</p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <Table className="min-w-[600px] sm:min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leases.map((lease) => (
                    <TableRow key={lease.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarImage src={lease.tenant?.profile?.avatarUrl || undefined} />
                            <AvatarFallback>
                              {lease.tenant?.profile?.fullName?.substring(0, 2).toUpperCase() || "T"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">
                              {lease.tenant?.profile?.fullName || "Unknown Tenant"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">
                            {lease.propertyUnit?.property?.title || "Property"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {lease.propertyUnit?.unitLabel || "Unit"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(lease.startDate), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        {format(new Date(lease.endDate), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          lease.status === "ACTIVE" ? "default" :
                          lease.status === "PENDING_PAYMENT" ? "outline" :
                          lease.status === "COMPLETED" ? "secondary" : "destructive"
                        }>
                          {lease.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground outline-none">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {lease.status !== "ACTIVE" && (
                              <DropdownMenuItem onClick={() => handleUpdateStatus(lease.id, "ACTIVE")}>
                                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                                Mark Active
                              </DropdownMenuItem>
                            )}
                            {lease.status !== "TERMINATED" && (
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleUpdateStatus(lease.id, "TERMINATED")}>
                                <AlertOctagon className="mr-2 h-4 w-4" />
                                Terminate Lease
                              </DropdownMenuItem>
                            )}
                            {lease.status !== "COMPLETED" && (
                              <DropdownMenuItem onClick={() => handleUpdateStatus(lease.id, "COMPLETED")}>
                                <Clock className="mr-2 h-4 w-4" />
                                Mark Completed
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
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

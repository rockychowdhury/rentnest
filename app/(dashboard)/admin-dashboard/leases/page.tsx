"use client";

import React, { useEffect, useState } from "react";
import { getAllLeases, adminUpdateLeaseStatus } from "../../_actions/adminActions";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, CheckCircle2, AlertOctagon, Clock, Search } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { CustomPagination } from "@/components/shared/pagination";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

export default function AdminLeasesPage() {
  const [leases, setLeases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: string | null; title: string }>({
    isOpen: false,
    id: null,
    title: ""
  });

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

  const handleConfirmTerminate = () => {
    if (confirmModal.id) {
      handleUpdateStatus(confirmModal.id, "TERMINATED");
      setConfirmModal({ isOpen: false, id: null, title: "" });
    }
  };

  const filteredLeases = leases.filter((lease) => {
    const tenantName = (lease.tenant?.profile?.fullName || "").toLowerCase();
    const propertyTitle = (lease.propertyUnit?.property?.title || "").toLowerCase();
    const matchesSearch = tenantName.includes(debouncedSearchQuery.toLowerCase()) || propertyTitle.includes(debouncedSearchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || lease.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const paginatedLeases = filteredLeases.slice((page - 1) * limit, page * limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leases</h1>
          <p className="text-muted-foreground mt-2">
            Global view of all active and past leases.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tenant or property..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val || "ALL"); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="PENDING_PAYMENT">Pending Payment</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="TERMINATED">Terminated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4">
              <TableSkeleton columns={6} rows={5} />
            </div>
          ) : filteredLeases.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {searchQuery || statusFilter !== "ALL" 
                ? "No leases found matching your filters." 
                : "No leases found in the system."}
            </div>
          ) : (
            <div className="overflow-x-auto w-full p-4 space-y-4">
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
                  {paginatedLeases.map((lease) => (
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
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive" 
                                onClick={() => setConfirmModal({ 
                                  isOpen: true, 
                                  id: lease.id, 
                                  title: lease.propertyUnit?.property?.title || "this lease" 
                                })}
                              >
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

              <CustomPagination
                meta={{ page, limit, total: filteredLeases.length }}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={handleConfirmTerminate}
        title="Terminate Lease"
        description={`Are you sure you want to terminate the lease for "${confirmModal.title}"? This action may have legal implications.`}
        confirmText="Terminate Lease"
        isDestructive={true}
      />
    </div>
  );
}

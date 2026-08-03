"use client";

import React, { useEffect, useState } from "react";
import { getAllRequests, adminCancelRentalRequest } from "../../_actions/adminActions";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, XCircle, Search } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { CustomPagination } from "@/components/shared/pagination";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [confirmAction, setConfirmAction] = useState<{ id: string } | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const result = await getAllRequests();
      const requestsArray = Array.isArray(result.data) ? result.data : (result.data?.data || []);
      setRequests(requestsArray);
    } catch (error) {
      toast.error("Failed to load rental requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCancelRequest = async (id: string) => {
    const res = await adminCancelRentalRequest(id);
    if (res.success) {
      toast.success("Rental request canceled");
      fetchRequests();
    } else {
      toast.error(res.error || "Failed to cancel request");
    }
  };

  const executeConfirmAction = () => {
    if (!confirmAction) return;
    handleCancelRequest(confirmAction.id);
    setConfirmAction(null);
  };

  const filteredRequests = requests.filter((r) => {
    const tenantName = (r.tenant?.profile?.fullName || "").toLowerCase();
    const propertyTitle = (r.propertyUnit?.property?.title || "").toLowerCase();
    const matchesSearch = tenantName.includes(debouncedSearchQuery.toLowerCase()) || propertyTitle.includes(debouncedSearchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const paginatedRequests = filteredRequests.slice((page - 1) * limit, page * limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rental Requests</h1>
          <p className="text-muted-foreground mt-2">
            Global view of all property rental requests.
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
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="CANCELLED">Canceled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4">
              <TableSkeleton columns={6} rows={6} />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {searchQuery || statusFilter !== "ALL"
                ? "No requests found matching the selected filters."
                : "No requests found in the system."}
            </div>
          ) : (
            <div className="overflow-x-auto w-full p-4 space-y-4">
              <Table className="min-w-[600px] sm:min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Move-in Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarImage src={request.tenant?.profile?.avatarUrl || undefined} />
                            <AvatarFallback>
                              {request.tenant?.profile?.fullName?.substring(0, 2).toUpperCase() || "T"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">
                              {request.tenant?.profile?.fullName || "Unknown Tenant"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {request.tenant?.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">
                            {request.propertyUnit?.property?.title || "Property"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {request.propertyUnit?.unitLabel || "Unit"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(request.moveInDate), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>{request.duration} Months</TableCell>
                      <TableCell>
                        <Badge variant={request.status === "PENDING" ? "outline" : request.status === "APPROVED" ? "default" : "destructive"}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {request.status !== "CANCELLED" && request.status !== "REJECTED" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground outline-none">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive" 
                                onClick={() => setConfirmAction({ id: request.id })}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancel Request
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
                meta={{ page, limit, total: filteredRequests.length }}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmModal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={executeConfirmAction}
        title="Cancel Request"
        description="Are you sure you want to cancel this rental request? This action cannot be undone."
        confirmText="Cancel Request"
        isDestructive={true}
      />
    </div>
  );
}

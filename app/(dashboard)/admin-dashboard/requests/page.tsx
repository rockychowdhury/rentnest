"use client";

import React, { useEffect, useState } from "react";
import { getAllRequests, adminCancelRentalRequest } from "../../_actions/adminActions";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    if (!window.confirm("Are you sure you want to cancel this rental request?")) return;
    const res = await adminCancelRentalRequest(id);
    if (res.success) {
      toast.success("Rental request canceled");
      fetchRequests();
    } else {
      toast.error(res.error || "Failed to cancel request");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rental Requests</h1>
        <p className="text-muted-foreground mt-2">
          Global view of all property rental requests.
        </p>
      </div>

      <Card className="border-border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading rental requests...</div>
          ) : requests.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>No requests found in the system.</p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
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
                  {requests.map((request) => (
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
                        {request.status !== "CANCELED" && request.status !== "REJECTED" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground outline-none">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleCancelRequest(request.id)}>
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

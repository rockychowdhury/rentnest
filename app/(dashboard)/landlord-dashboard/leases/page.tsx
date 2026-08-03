import React from "react";
import { getLandlordLeases, updateLeaseStatus } from "../../_actions/leaseActions";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Lease } from "@/types";
import { TerminateLeaseButton } from "./terminate-lease-button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leases | Landlord Dashboard | RentNest",
};

export default async function LeasesPage() {
  const result = await getLandlordLeases();
  const leases: Lease[] = result.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leases</h1>
        <p className="text-muted-foreground mt-2">
          Manage active, pending, and past leases for your properties.
        </p>
      </div>

      <Card className="border-border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">

        <CardContent className="p-0">
          {leases.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>No leases found at this time.</p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <Table className="min-w-[650px] sm:min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
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
                      <TableCell className="text-right">
                        {lease.status === "ACTIVE" && (
                          <TerminateLeaseButton leaseId={lease.id} />
                        )}
                        {lease.status === "PENDING_PAYMENT" && (
                          <span className="text-sm text-muted-foreground">Waiting for Tenant</span>
                        )}
                        {(lease.status === "COMPLETED" || lease.status === "TERMINATED") && (
                          <span className="text-sm text-muted-foreground">Closed</span>
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

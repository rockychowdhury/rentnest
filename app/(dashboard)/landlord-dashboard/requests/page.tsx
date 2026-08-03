import React from "react";
import { getIncomingRentalRequests, respondToRentalRequest } from "../../_actions/rentRequestActions";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RentalRequest } from "@/types";
import { RequestActions } from "./request-actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rent Requests | Landlord Dashboard | RentNest",
};

export default async function RequestsPage() {
  const result = await getIncomingRentalRequests();
  const requests: RentalRequest[] = result.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rent Requests</h1>
        <p className="text-muted-foreground mt-2">
          Manage incoming rental requests for your properties.
        </p>
      </div>

      <Card className="border-border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">

        <CardContent className="p-0">
          {requests.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>No incoming requests found at this time.</p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <Table className="min-w-[650px] sm:min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Agreed Rent</TableHead>
                  <TableHead>Move-in Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
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
                      <span className="font-semibold text-foreground">৳{Number(request.agreedAmount ?? request.pricing?.rentAmount ?? 0).toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground block capitalize">/ {(request.rentType || request.pricing?.rentType || 'monthly').toLowerCase()}</span>
                    </TableCell>
                    <TableCell>
                      {format(new Date(request.moveInDate), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      {request.duration} {request.rentType === "YEARLY" ? (request.duration > 1 ? "Years" : "Year") : request.rentType === "WEEKLY" ? (request.duration > 1 ? "Weeks" : "Week") : request.rentType === "DAILY" ? (request.duration > 1 ? "Days" : "Day") : (request.duration > 1 ? "Months" : "Month")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={request.status === "PENDING" ? "outline" : request.status === "APPROVED" ? "default" : "destructive"}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {request.status === "PENDING" && (
                        <RequestActions requestId={request.id} />
                      )}
                      {request.status !== "PENDING" && (
                        <span className="text-sm text-muted-foreground">Responded</span>
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

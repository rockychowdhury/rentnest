"use client";

import React, { useEffect, useState } from "react";
import { getLandlordPayments } from "../../_actions/paymentActions";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Payment } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("COMPLETED");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const result = await getLandlordPayments(statusFilter === "ALL" ? undefined : statusFilter);
        setPayments(result.data || []);
      } catch (error) {
        console.error("Failed to fetch payments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
            View transaction history and track rent payments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-medium shrink-0">Filter Status:</span>
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "ALL")}>
            <SelectTrigger className="w-[140px] sm:w-[180px]">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Payments</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
              <SelectItem value="REFUNDED">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">

        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading payments...</div>
          ) : payments.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>No payments found matching the selected filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <Table className="min-w-[650px] sm:min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-xs">
                        {payment.transactionId || payment.id.substring(0, 13)}
                      </TableCell>
                      <TableCell>
                        {payment.lease?.tenant?.profile?.fullName || "Unknown Tenant"}
                      </TableCell>
                      <TableCell>
                        {payment.lease?.propertyUnit?.property?.title || "Property"} - {payment.lease?.propertyUnit?.unitLabel || "Unit"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {payment.currency} {payment.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {payment.paymentDate ? format(new Date(payment.paymentDate), "MMM dd, yyyy") : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          payment.status === "COMPLETED" ? "default" :
                          payment.status === "PENDING" ? "outline" : "destructive"
                        }>
                          {payment.status}
                        </Badge>
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

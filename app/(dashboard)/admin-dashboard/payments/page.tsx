"use client";

import React, { useEffect, useState } from "react";
import { getAllPayments } from "../../_actions/adminActions";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { CustomPagination } from "@/components/shared/pagination";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const result = await getAllPayments();
        const fetchedPayments = Array.isArray(result.data) ? result.data : (result.data?.data || []);
        setPayments(fetchedPayments);
      } catch (error) {
        toast.error("Failed to fetch payments");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((p) => {
    const transactionId = (p.transactionId || p.id).toLowerCase();
    const tenantName = (p.lease?.tenant?.profile?.fullName || "").toLowerCase();
    const matchesSearch = transactionId.includes(debouncedSearchQuery.toLowerCase()) || tenantName.includes(debouncedSearchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const paginatedPayments = filteredPayments.slice((page - 1) * limit, page * limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
            View transaction history and track rent payments globally.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tenant or transaction ID..."
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
            <div className="p-4">
               <TableSkeleton columns={6} rows={8} />
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {searchQuery || statusFilter !== "ALL"
                ? "No payments found matching the selected filters."
                : "No payments found in the system."}
            </div>
          ) : (
            <div className="overflow-x-auto w-full p-4 space-y-4">
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
                  {paginatedPayments.map((payment) => (
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

              <CustomPagination
                meta={{ page, limit, total: filteredPayments.length }}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

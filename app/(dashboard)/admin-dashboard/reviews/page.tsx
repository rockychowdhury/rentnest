"use client";

import React, { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { adminDeleteReview, getAllReviews } from "../../_actions/adminActions";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Star, Search } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { CustomPagination } from "@/components/shared/pagination";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);
  const [page, setPage] = useState(1);
  const limit = 10;

  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });

  const fetchAllReviews = async () => {
    setLoading(true);
    try {
      const res = await getAllReviews();
      if (res.success) {
        setReviews(res.data || []);
      } else {
        toast.error(res.error || "Failed to load reviews");
      }
    } catch (error) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const handleConfirmDelete = async () => {
    if (!confirmModal.id) return;
    
    const res = await adminDeleteReview(confirmModal.id);
    if (res.success) {
      toast.success("Review deleted successfully");
      fetchAllReviews();
    } else {
      toast.error(res.error || "Failed to delete review");
    }
    
    setConfirmModal({ isOpen: false, id: null });
  };

  const filteredReviews = reviews.filter((review) => {
    const propertyTitle = (review.propertyTitle || review.property?.title || "").toLowerCase();
    const tenantName = (review.tenant?.profile?.fullName || review.tenant?.email || "").toLowerCase();
    
    return propertyTitle.includes(debouncedSearchQuery.toLowerCase()) || tenantName.includes(debouncedSearchQuery.toLowerCase());
  });

  const paginatedReviews = filteredReviews.slice((page - 1) * limit, page * limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reviews Moderation</h1>
          <p className="text-muted-foreground mt-2">
            Moderate tenant reviews submitted for rental properties.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search property or tenant..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <Card className="border-border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4">
               <TableSkeleton columns={6} rows={5} />
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {searchQuery ? "No property reviews found matching your search." : "No property reviews found."}
            </div>
          ) : (
            <div className="overflow-x-auto w-full p-4 space-y-4">
              <Table className="min-w-[700px] sm:min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium text-sm">
                        {review.propertyTitle || review.property?.title || "Property"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {review.tenant?.profile?.fullName || review.tenant?.email || "Tenant"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-amber-500 font-semibold text-xs">
                          <Star className="size-4 fill-amber-500 text-amber-500" />
                          <span>{review.rating} / 5</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate text-xs text-muted-foreground">
                        {review.comment}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {review.createdAt ? format(new Date(review.createdAt), "MMM dd, yyyy") : "-"}
                      </TableCell>
                      <TableCell>
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
                              onClick={() => setConfirmModal({ isOpen: true, id: review.id })}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Review
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <CustomPagination
                meta={{ page, limit, total: filteredReviews.length }}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete Review"
        isDestructive={true}
      />
    </div>
  );
}

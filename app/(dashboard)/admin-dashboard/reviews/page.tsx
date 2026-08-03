"use client";

import React, { useEffect, useState } from "react";
import { fetchApi } from "@/lib/api";
import { adminDeleteReview } from "../../_actions/adminActions";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Star } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllReviews = async () => {
    setLoading(true);
    try {
      // Get properties first to fetch property reviews, or fetch via public property reviews endpoint
      const propsRes = await fetchApi("/properties");
      const properties: any[] = Array.isArray(propsRes.data) ? propsRes.data : (propsRes.data?.data || []);
      
      let allReviews: any[] = [];
      await Promise.all(
        properties.map(async (prop) => {
          try {
            const revRes = await fetchApi(`/reviews/property/${prop.id}`);
            const revs = Array.isArray(revRes.data) ? revRes.data : (revRes.data?.data || []);
            revs.forEach((r: any) => {
              allReviews.push({ ...r, propertyTitle: prop.title });
            });
          } catch (e) {
            // ignore
          }
        })
      );
      setReviews(allReviews);
    } catch (error) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    const res = await adminDeleteReview(id);
    if (res.success) {
      toast.success("Review deleted successfully");
      fetchAllReviews();
    } else {
      toast.error(res.error || "Failed to delete review");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reviews Moderation</h1>
        <p className="text-muted-foreground mt-2">
          Moderate tenant reviews submitted for rental properties.
        </p>
      </div>

      <Card className="border-border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No property reviews found.</div>
          ) : (
            <div className="overflow-x-auto w-full">
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
                  {reviews.map((review) => (
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
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDeleteReview(review.id)}>
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

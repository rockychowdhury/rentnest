"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Star,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  PenLine,
  CheckCircle2,
  Trash2,
  Edit2,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PropertyImage } from "@/components/shared/PropertyImage";
import { createReview, updateReview, deleteReview } from "../../_actions/tenantReviews";
import { reviewSchema } from "@/lib/validators/forms.validator";
import { cn } from "@/lib/utils/shadcnUtils";

interface ReviewsClientProps {
  reviewsData: {
    written: any[];
    eligible: any[];
  };
}

export function ReviewsClient({ reviewsData }: ReviewsClientProps) {
  const { written, eligible } = reviewsData;
  const [eligibleIndex, setEligibleIndex] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);
  const [targetProperty, setTargetProperty] = useState<any>(null);
  const [targetLeaseId, setTargetLeaseId] = useState<string | undefined>(undefined);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleNextEligible = () => {
    setEligibleIndex((prev) => (prev + 1) % eligible.length);
  };
  const handlePrevEligible = () => {
    setEligibleIndex((prev) => (prev - 1 + eligible.length) % eligible.length);
  };

  const eligibleLease = eligible[eligibleIndex];

  const handleOpenNewReview = (lease: any) => {
    const prop = lease.property || lease.propertyUnit?.property;
    setTargetProperty(prop);
    setTargetLeaseId(lease.id);
    setActiveReviewId(null);
    setIsEditing(false);
    setRating(5);
    setComment("");
    setModalOpen(true);
  };

  const handleOpenEditReview = (review: any) => {
    setTargetProperty(review.property);
    setTargetLeaseId(review.leaseId);
    setActiveReviewId(review.id);
    setIsEditing(true);
    setRating(review.rating || 5);
    setComment(review.comment || "");
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = reviewSchema.safeParse({ rating, comment });
    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message || "Validation failed");
      return;
    }

    startTransition(async () => {
      if (isEditing && activeReviewId) {
        const res = await updateReview(activeReviewId, { rating, comment });
        if (res.success) {
          toast.success("Review updated successfully!");
          setModalOpen(false);
        } else {
          toast.error(res.error || "Failed to update review.");
        }
      } else {
        const propertyId = targetProperty?.id;
        if (!propertyId) {
          toast.error("Invalid property selection.");
          return;
        }

        const res = await createReview({
          propertyId,
          leaseId: targetLeaseId,
          rating,
          comment,
        });

        if (res.success) {
          toast.success("Thank you! Your review has been published.");
          setModalOpen(false);
        } else {
          toast.error(res.error || "Failed to submit review.");
        }
      }
    });
  };

  const handleDelete = (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    startTransition(async () => {
      const res = await deleteReview(reviewId);
      if (res.success) {
        toast.success("Review deleted successfully.");
      } else {
        toast.error(res.error || "Failed to delete review.");
      }
    });
  };

  const ratingLabels: Record<number, string> = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-heading font-semibold text-foreground">My Reviews</h2>
        <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
          Manage reviews you've written for properties and completed leases.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Your Written Reviews ({written.length})
          </h3>

          {written.length > 0 ? (
            <div className="space-y-6">
              {written.map((review) => {
                const propImage = review.property?.images?.[0]?.url;

                return (
                  <div
                    key={review.id}
                    className="bg-card border border-border/80 rounded-2xl p-6 shadow-xs hover:border-border transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-border/50">
                      <div className="flex items-center gap-4">
                        <div className="size-14 rounded-xl overflow-hidden bg-muted relative shrink-0">
                          <PropertyImage
                            src={propImage}
                            alt={review.property?.title || "Property"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-heading font-semibold text-foreground text-sm sm:text-base line-clamp-1">
                            {review.property?.title || "Property Listing"}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(review.createdAt || review.submittedAt || Date.now()).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-lg shrink-0 w-fit">
                        <Star className="size-4 fill-amber-500 text-amber-500" />
                        <span className="font-bold text-sm">{review.rating}</span>
                        <span className="text-xs text-muted-foreground font-normal">/ 5</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {review.comment ? (
                        <p className="text-sm text-foreground/90 leading-relaxed italic bg-muted/30 p-4 rounded-xl border border-border/30">
                          "{review.comment}"
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">No written comment provided.</p>
                      )}

                      {review.landlordResponse && (
                        <div className="pl-4 border-l-2 border-primary/40 mt-4 py-1">
                          <p className="text-xs font-semibold text-foreground mb-1">Landlord Response:</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">{review.landlordResponse}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-2 mt-5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs gap-1.5 h-8"
                        onClick={() => handleOpenEditReview(review)}
                      >
                        <Edit2 className="size-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleDelete(review.id)}
                        className="text-xs gap-1.5 h-8 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                      >
                        <Trash2 className="size-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-muted/20 border border-dashed border-border/60 rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-3 min-h-[260px]">
              <MessageSquare className="size-9 text-muted-foreground/40" />
              <p className="text-sm font-medium text-foreground">No written reviews yet</p>
              <p className="text-xs text-muted-foreground max-w-[280px]">
                Once you complete a rental lease, your review card will appear here.
              </p>
            </div>
          )}
        </div>

                <div className="lg:col-span-1 space-y-6">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Eligible to Review ({eligible.length})
          </h3>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 relative overflow-hidden shadow-xs">
            {eligible.length > 0 ? (
              <>
                {eligible.length > 1 && (
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-7 rounded-full bg-background"
                      onClick={handlePrevEligible}
                    >
                      <ChevronLeft className="size-3.5" />
                    </Button>
                    <span className="text-[10px] font-semibold text-muted-foreground px-1">
                      {eligibleIndex + 1}/{eligible.length}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-7 rounded-full bg-background"
                      onClick={handleNextEligible}
                    >
                      <ChevronRight className="size-3.5" />
                    </Button>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <Star className="size-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-foreground text-sm">Write a Review</h4>
                      <p className="text-xs text-muted-foreground">Share your stay experience.</p>
                    </div>
                  </div>

                  <div className="bg-background border border-border/60 rounded-xl p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="size-12 rounded-lg overflow-hidden bg-muted relative shrink-0">
                        <PropertyImage
                          src={eligibleLease.property?.images?.[0]?.url}
                          alt={eligibleLease.property?.title || "Property"}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-xs sm:text-sm text-foreground line-clamp-1">
                          {eligibleLease.property?.title || "Completed Rental Space"}
                        </h5>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            {eligibleLease.status || "Completed"}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            {eligibleLease.propertyUnit?.unitLabel || "Unit"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleOpenNewReview(eligibleLease)}
                      className="w-full shadow-sm gap-2 text-xs h-9 mt-2"
                    >
                      <PenLine className="size-3.5" /> Start Review
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-center space-y-3 py-8 opacity-80">
                <CheckCircle2 className="size-9 text-primary/60" />
                <p className="text-sm font-semibold text-foreground">You're all caught up!</p>
                <p className="text-xs text-muted-foreground max-w-[220px]">
                  No pending completed leases awaiting review.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-heading font-bold">
              {isEditing ? "Edit Review" : "Write a Review"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {targetProperty?.title || "Property Review"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 py-2">
                        <div className="space-y-2 text-center bg-muted/30 p-4 rounded-xl border border-border/40">
              <label className="text-xs font-semibold text-foreground block">
                Overall Rating
              </label>

              <div className="flex items-center justify-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={cn(
                          "size-7 transition-colors",
                          active
                            ? "text-amber-500 fill-amber-500"
                            : "text-muted-foreground/30 hover:text-amber-400"
                        )}
                      />
                    </button>
                  );
                })}
              </div>

              <span className="text-xs font-medium text-amber-600 dark:text-amber-400 block h-4">
                {ratingLabels[hoverRating || rating] || ""}
              </span>
            </div>

                        <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">
                Your Review / Comment (Optional)
              </label>
              <Textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience regarding property condition, landlord responsiveness, neighborhood, etc..."
                className="text-xs bg-muted/20 resize-none"
              />
            </div>

            <DialogFooter className="gap-2 pt-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isPending} className="text-xs font-semibold gap-1.5">
                {isPending && <Loader2 className="size-3.5 animate-spin" />}
                {isEditing ? "Save Changes" : "Submit Review"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ReviewsClient;

"use client";

import React, { useEffect, useState } from "react";
import { getLandlordReviews, respondToReview } from "../../_actions/reviewActions";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Review } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const result = await getLandlordReviews();
      setReviews(result.data || []);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (reviewId: string) => {
    if (!responseText.trim()) {
      toast.error("Response cannot be empty");
      return;
    }
    setSubmitting(true);
    try {
      const res = await respondToReview(reviewId, responseText);
      if (res.success) {
        toast.success("Responded successfully");
        setReplyingTo(null);
        setResponseText("");
        fetchReviews(); // Refresh
      } else {
        toast.error(res.message || "Failed to respond");
      }
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
        <p className="text-muted-foreground mt-2">
          Read what tenants are saying about your properties and respond to their feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <Card className="border-border shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8 text-center text-muted-foreground">
              <p>No reviews found for your properties.</p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="border-border shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="shrink-0 flex flex-col items-center gap-2">
                    <Avatar className="size-16">
                      <AvatarImage src={review.tenant?.profile?.avatarUrl || undefined} />
                      <AvatarFallback className="text-xl">
                        {review.tenant?.profile?.fullName?.substring(0, 2).toUpperCase() || "T"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-sm text-center">
                      {review.tenant?.profile?.fullName || "Anonymous"}
                    </span>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex text-yellow-400 mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star}
                              className={`size-5 ${star <= review.rating ? "fill-current" : "text-muted stroke-current"}`} 
                            />
                          ))}
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Property: <span className="text-foreground">{review.property?.title || "Property"}</span>
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(review.createdAt), "MMM dd, yyyy")}
                      </span>
                    </div>

                    <p className="text-foreground/90">{review.comment}</p>

                    {/* Landlord Response Section */}
                    {review.landlordResponse ? (
                      <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
                        <p className="text-xs font-semibold text-primary mb-1">Your Response:</p>
                        <p className="text-sm">{review.landlordResponse}</p>
                      </div>
                    ) : (
                      <div className="mt-4">
                        {replyingTo === review.id ? (
                          <div className="space-y-3">
                            <Textarea 
                              placeholder="Write your response..." 
                              value={responseText}
                              onChange={(e) => setResponseText(e.target.value)}
                              className="min-h-[100px] resize-none"
                            />
                            <div className="flex gap-2 justify-end">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  setReplyingTo(null);
                                  setResponseText("");
                                }}
                                disabled={submitting}
                              >
                                Cancel
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => handleRespond(review.id)}
                                disabled={submitting}
                              >
                                {submitting ? "Submitting..." : "Submit Response"}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => setReplyingTo(review.id)}
                          >
                            Reply to Review
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

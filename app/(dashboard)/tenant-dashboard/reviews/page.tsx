import React from "react";
import { getTenantReviews } from "../../_actions/tenantReviews";
import { ReviewsClient } from "./reviews-client";

export default async function TenantReviewsPage() {
  const reviewsRes = await getTenantReviews();
  const reviewsData = reviewsRes.data;

  return <ReviewsClient reviewsData={reviewsData} />;
}

import React, { Suspense } from "react";
import { getTenantReviews } from "../../_actions/tenantReviews";
import { ReviewsClient } from "./reviews-client";
import { ListRowsSkeleton } from "@/components/dashboard/section-skeletons";

export default function TenantReviewsPage() {
  return (
    <Suspense fallback={<TenantReviewsFallback />}>
      <ReviewsData />
    </Suspense>
  );
}

function TenantReviewsFallback() {
  return (
    <div className="space-y-8" aria-hidden="true">
      <div className="space-y-2">
        <div className="h-7 w-44 rounded-md bg-muted animate-pulse" />
        <div className="h-4 w-72 rounded-md bg-muted animate-pulse" />
      </div>
      <ListRowsSkeleton rows={3} />
    </div>
  );
}

async function ReviewsData() {
  const reviewsRes = await getTenantReviews();
  const reviewsData = reviewsRes.data;

  return <ReviewsClient reviewsData={reviewsData} />;
}

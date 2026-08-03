import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle, RefreshCcw } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="bg-card border border-border shadow-lg rounded-2xl p-8 max-w-md w-full text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="size-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="size-10" />
        </div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Payment Cancelled</h1>
        <p className="text-muted-foreground mb-8">
          The payment process was cancelled or interrupted. Your account has not been charged.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/tenant-dashboard/payments">
            <Button className="w-full h-12 text-md gap-2">
              <RefreshCcw className="size-4" /> Try Again
            </Button>
          </Link>
          <Link href="/tenant-dashboard">
            <Button variant="outline" className="w-full h-12 text-md">
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="bg-card border border-border shadow-lg rounded-2xl p-8 max-w-md w-full text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="size-20 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="size-10" />
        </div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground mb-8">
          Your payment has been securely processed. Your lease and payment status will be updated shortly.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/tenant-dashboard">
            <Button className="w-full h-12 text-md">
              Return to Dashboard
            </Button>
          </Link>
          <Link href="/tenant-dashboard/payments">
            <Button variant="outline" className="w-full h-12 text-md">
              View Payment History <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

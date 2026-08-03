"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, ArrowRight } from "lucide-react";
import { checkoutLeasePayment } from "@/app/(dashboard)/_actions/tenantPayments";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CheckoutButtonProps {
  leaseId: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
  children?: React.ReactNode;
}

export function CheckoutButton({ leaseId, variant = "default", className, children }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const res = await checkoutLeasePayment(leaseId);
      const paymentUrl =
        res.data?.paymentUrl ||
        res.data?.url ||
        res.data?.checkoutUrl ||
        res.data?.gatewayUrl ||
        (typeof res.data === "string" ? res.data : undefined);

      if (res.success && paymentUrl) {
        // Redirect to payment checkout page
        window.location.href = paymentUrl;
      } else {
        toast.error(res.error || res.message || "Failed to initialize payment");
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant={variant} 
      className={className} 
      onClick={handleCheckout} 
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
      {children || (
        <>
          <CreditCard className="mr-2 size-4" /> Pay Now
        </>
      )}
    </Button>
  );
}

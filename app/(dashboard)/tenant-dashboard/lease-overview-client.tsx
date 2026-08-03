"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight, CheckCircle, Clock, AlertCircle, Building, FileText, Key } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CheckoutButton } from "@/components/payments/CheckoutButton";

export function LeaseOverviewClient({ leases }: { leases: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!leases || leases.length === 0) {
    return (
      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
        <div>
          <h3 className="text-2xl font-heading font-bold text-foreground mb-2">Find your next place</h3>
          <p className="text-muted-foreground max-w-md">
            You don't have an active lease right now. Browse available properties and schedule a visit today.
          </p>
        </div>
        <Link href="/properties">
          <Button size="lg" className="w-full sm:w-auto shadow-md hover:shadow-lg transition-all">
            Browse Properties <ArrowRight className="ml-2 size-4" />
          </Button>
        </Link>
      </div>
    );
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % leases.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + leases.length) % leases.length);
  };

  const lease = leases[currentIndex];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-500/10 text-green-700 border-green-500/20";
      case "COMPLETED": return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      case "PENDING_PAYMENT": return "bg-amber-500/10 text-amber-700 border-amber-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="relative group bg-card border border-border shadow-sm rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md">
            {leases.length > 1 && (
        <div className="absolute top-4 right-4 flex gap-1 z-20">
          <Button variant="secondary" size="icon" className="size-8 rounded-full shadow-sm hover:bg-primary hover:text-primary-foreground transition-colors" onClick={handlePrev}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="secondary" size="icon" className="size-8 rounded-full shadow-sm hover:bg-primary hover:text-primary-foreground transition-colors" onClick={handleNext}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}

            {leases.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-20">
          {leases.map((_, idx) => (
            <div key={idx} className={`h-1.5 rounded-full transition-all ${idx === currentIndex ? 'w-4 bg-primary' : 'w-1.5 bg-border'}`} />
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row relative z-10">
                <div className="w-full sm:w-1/3 bg-muted/30 p-6 sm:p-8 flex flex-col justify-between border-b sm:border-b-0 sm:border-r border-border">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Statement</span>
              <Badge variant="outline" className={getStatusColor(lease.status)}>
                {lease.status.replace("_", " ")}
              </Badge>
            </div>
            
            <div className="space-y-1">
              <h4 className="text-4xl font-heading font-bold text-foreground">
                ৳{Number(lease.agreedAmount).toLocaleString()}
              </h4>
              <p className="text-sm font-medium text-muted-foreground">
                / {lease.rentType?.toLowerCase()}
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Start Date</span>
                <span className="font-semibold">{format(new Date(lease.startDate), "MMM d, yyyy")}</span>
              </div>
              {lease.endDate && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">End Date</span>
                  <span className="font-semibold">{format(new Date(lease.endDate), "MMM d, yyyy")}</span>
                </div>
              )}
            </div>
          </div>
          
          {lease.status === "PENDING_PAYMENT" && (
            <div className="mt-6">
              <CheckoutButton leaseId={lease.id} className="w-full shadow-sm hover:shadow-md transition-all">
                Pay Now <ArrowRight className="ml-2 size-4" />
              </CheckoutButton>
            </div>
          )}
        </div>

                <div className="w-full sm:w-2/3 p-6 sm:p-8 flex flex-col justify-center">
          <Badge variant="secondary" className="w-fit mb-3 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            <Key className="mr-1.5 size-3.5" /> Active Lease
          </Badge>
          
          <h3 className="text-2xl font-heading font-bold text-foreground line-clamp-1 mb-2">
            {lease.propertyUnit?.property?.title || "Property"}
          </h3>
          
          <div className="flex items-center gap-2 text-muted-foreground mb-6">
            <Building className="size-4" />
            <span className="font-medium text-sm">Unit: {lease.propertyUnit?.unitLabel || "N/A"}</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mt-auto">
            <Link href={`/tenant-dashboard/lease/${lease.id}`}>
              <Button variant="outline" className="shadow-sm">
                <FileText className="mr-2 size-4" /> View Details
              </Button>
            </Link>
            <Link href={`/properties/${lease.propertyUnit?.property?.id}`}>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                View Property
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

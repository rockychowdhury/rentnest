"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Key, Calendar, CreditCard, ChevronLeft, ChevronRight, FileCheck, Info } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CheckoutButton } from "@/components/payments/CheckoutButton";
import { ReusableModal } from "@/components/shared/reusable-modal";

export function LeaseClient({ leases, reviewedLeaseIds = [] }: { leases: any[], reviewedLeaseIds?: string[] }) {
  const pendingPaymentLeases = leases.filter(l => ["PENDING", "PENDING_PAYMENT"].includes(l.status));
  const activeLeases = leases.filter(l => l.status === "ACTIVE");
  const completedLeases = leases.filter(l => ["COMPLETED", "TERMINATED", "CANCELLED"].includes(l.status));

  const primaryLeases = [...pendingPaymentLeases, ...activeLeases];
  
  const [primaryIndex, setPrimaryIndex] = useState(0);
  const [isLeaseModalOpen, setIsLeaseModalOpen] = useState(false);

  const handleNextPrimary = () => {
    setPrimaryIndex((prev) => (prev + 1) % primaryLeases.length);
  };
  const handlePrevPrimary = () => {
    setPrimaryIndex((prev) => (prev - 1 + primaryLeases.length) % primaryLeases.length);
  };

  const primaryLease = primaryLeases[primaryIndex];
  const isPrimaryPendingPayment = primaryLease?.status === "PENDING_PAYMENT";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-heading font-semibold text-foreground">My Leases</h2>
        <p className="text-muted-foreground mt-1">Manage your active, pending, and past leases.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">
                <div className="md:col-span-2 bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col sm:flex-row relative h-full min-h-[250px] transition-all duration-300">
          {primaryLeases.length > 1 && (
            <div className="absolute top-4 right-4 z-20 flex gap-1">
              <Button variant="secondary" size="icon" className="size-8 rounded-full shadow-sm hover:bg-primary hover:text-primary-foreground transition-colors" onClick={handlePrevPrimary}>
                <ChevronLeft className="size-4" />
              </Button>
              <Button variant="secondary" size="icon" className="size-8 rounded-full shadow-sm hover:bg-primary hover:text-primary-foreground transition-colors" onClick={handleNextPrimary}>
                <ChevronRight className="size-4" />
              </Button>
            </div>
          )}

          {primaryLeases.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-20 pointer-events-none">
              {primaryLeases.map((_, idx) => (
                <div key={idx} className={`h-1.5 rounded-full transition-all ${idx === primaryIndex ? 'w-4 bg-primary' : 'w-1.5 bg-border'}`} />
              ))}
            </div>
          )}

          {primaryLease ? (
            <>
                            <div className="w-full sm:w-1/3 bg-muted/30 p-6 flex flex-col justify-between border-b sm:border-b-0 sm:border-r border-border">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Statement</span>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-3xl font-heading font-bold text-foreground truncate">
                      ৳{Number(primaryLease.agreedAmount || primaryLease.rentAmount || 0).toLocaleString()}
                    </h4>
                    <p className="text-sm font-medium text-muted-foreground">
                      / {primaryLease.rentType?.toLowerCase() || 'monthly'}
                    </p>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Start Date</span>
                      <span className="font-semibold">{format(new Date(primaryLease.startDate || primaryLease.moveInDate), "MMM d, yyyy")}</span>
                    </div>
                    {primaryLease.endDate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">End Date</span>
                        <span className="font-semibold">{format(new Date(primaryLease.endDate), "MMM d, yyyy")}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {isPrimaryPendingPayment && (
                  <div className="mt-6">
                    <CheckoutButton leaseId={primaryLease.id} className="w-full shadow-sm hover:shadow-md transition-all gap-2" />
                  </div>
                )}
              </div>

                            <div className="w-full sm:w-2/3 p-6 flex flex-col">
                <Badge className="w-fit mb-4 shadow-sm" variant={isPrimaryPendingPayment ? "destructive" : primaryLease?.status === "PENDING" ? "secondary" : "default"}>
                  {isPrimaryPendingPayment ? "Payment Required" : primaryLease?.status === "PENDING" ? "Pending Approval" : "Active Lease"}
                </Badge>
                
                <h3 className="text-2xl font-heading font-semibold text-foreground mb-2">
                  {primaryLease.propertyUnit?.property?.title || primaryLease.property?.title || "Property"}
                </h3>
                
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-6">
                  <Key className="size-4" /> Unit: {primaryLease.propertyUnit?.unitLabel || "N/A"}
                </p>
                
                {isPrimaryPendingPayment ? (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-4 flex items-start gap-3 mt-auto">
                    <Info className="size-5 text-destructive shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-semibold text-destructive text-sm">Action Required</p>
                      <p className="text-xs text-destructive/80">Please pay the initial rent and security deposit to activate your lease.</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-auto" />
                )}

                <div className="flex flex-wrap gap-3 mt-4">
                  <Button variant="outline" className="flex-1 w-full sm:w-auto shadow-sm" onClick={() => setIsLeaseModalOpen(true)}>
                    <FileCheck className="mr-2 size-4" /> Lease Details
                  </Button>
                  <Link href={`/properties/${primaryLease.propertyUnit?.property?.id || ''}/${primaryLease.propertyUnit?.property?.slug || ''}`} className="w-full sm:w-auto">
                    <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
                      View Property
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full p-8 text-center bg-primary/5">
               <div className="size-16 bg-background rounded-full flex items-center justify-center shadow-sm mb-4">
                 <Key className="size-8 text-muted-foreground" />
               </div>
               <h3 className="text-lg font-semibold mb-2">No Active Lease</h3>
               <p className="text-sm text-muted-foreground mb-6 max-w-[250px]">You don't have any active or pending leases at the moment.</p>
               <div className="flex flex-col sm:flex-row gap-3 w-full max-w-[300px]">
                 <Link href="/properties" className="flex-1">
                   <Button className="w-full">Browse Properties</Button>
                 </Link>
                 <Link href="/tenant-dashboard/applications" className="flex-1">
                   <Button variant="outline" className="w-full">View Requests</Button>
                 </Link>
               </div>
            </div>
          )}
        </div>

                <div className="md:col-span-1 bg-card border border-border rounded-2xl p-6 flex flex-col shadow-sm">
           <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Past Leases</h3>
           
           <div className="flex-1 overflow-y-auto pr-2 space-y-4">
             {completedLeases.length > 0 ? (
               completedLeases.map((lease) => (
                 <div key={lease.id} className="p-4 border border-border/50 rounded-xl bg-muted/20 hover:bg-muted/50 transition-colors">
                   <h4 className="font-medium text-sm text-foreground line-clamp-1 mb-1">
                     {lease.propertyUnit?.property?.title || lease.property?.title || "Property"}
                   </h4>
                   <div className="flex justify-between items-center text-xs text-muted-foreground mb-3">
                     <span>{lease.rentType ? lease.rentType.charAt(0) + lease.rentType.slice(1).toLowerCase() : "Past Lease"}</span>
                     <Badge variant="outline" className="text-[10px] h-5">{lease.status}</Badge>
                   </div>
                   {!reviewedLeaseIds.includes(lease.id) && (
                     <Link href={`/tenant-dashboard/reviews`}>
                       <Button size="sm" variant="secondary" className="w-full text-xs h-8 mt-2">Leave a Review</Button>
                     </Link>
                   )}
                 </div>
               ))
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-60">
                 <FileCheck className="size-8 text-muted-foreground" />
                 <p className="text-sm text-muted-foreground">No past leases found.</p>
               </div>
             )}
           </div>
        </div>
      </div>

      {primaryLease && (
        <ReusableModal
          isOpen={isLeaseModalOpen}
          onOpenChange={setIsLeaseModalOpen}
          title="Lease Details"
        >
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={primaryLease.status === "PENDING_PAYMENT" ? "destructive" : "default"} className="mt-1">
                  {primaryLease.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rent Amount</p>
                <p className="font-semibold text-foreground">৳{Number(primaryLease.agreedAmount || primaryLease.rentAmount || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-semibold text-foreground">{format(new Date(primaryLease.startDate || primaryLease.moveInDate || new Date()), "MMM d, yyyy")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">End Date</p>
                <p className="font-semibold text-foreground">{primaryLease.endDate ? format(new Date(primaryLease.endDate), "MMM d, yyyy") : "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rent Type</p>
                <p className="font-semibold text-foreground capitalize">{primaryLease.rentType?.toLowerCase() || 'Monthly'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Property</p>
                <p className="font-semibold text-foreground">{primaryLease.propertyUnit?.property?.title || primaryLease.property?.title}</p>
                <p className="text-sm text-muted-foreground mt-0.5">Unit: {primaryLease.propertyUnit?.unitLabel}</p>
              </div>
            </div>
            
            {primaryLease.status === "PENDING_PAYMENT" && (
              <div className="pt-4 border-t border-border mt-4">
                <CheckoutButton leaseId={primaryLease.id} className="w-full" />
              </div>
            )}
          </div>
        </ReusableModal>
      )}
    </div>
  );
}

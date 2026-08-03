"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Calendar, CheckCircle2, Clock, XCircle, ArrowRight } from "lucide-react";
import { ReusableModal } from "@/components/shared/reusable-modal";
import { cancelRentalRequest, getRentalRequestDetails } from "../../_actions/tenantApplications";
import { toast } from "sonner";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function ApplicationsClient({ applications }: { applications: any[] }) {
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  const pendingApps = applications.filter(a => a.status === "PENDING");
  const approvedApps = applications.filter(a => a.status === "APPROVED");
  const otherApps = applications.filter(a => ["REJECTED", "CANCELLED", "EXPIRED"].includes(a.status));

  const handleOpenDetails = async (app: any) => {
    setSelectedApp(app);
    setModalOpen(true);
  };

  const handleCancelRequest = async (id: string) => {
    setIsCanceling(true);
    const res = await cancelRentalRequest(id);
    setIsCanceling(false);
    if (res.success) {
      toast.success("Rental request cancelled successfully");
      setModalOpen(false);
    } else {
      toast.error(res.error || "Failed to cancel request");
    }
  };

  const RequestCard = ({ app }: { app: any }) => {
    const isApproved = app.status === "APPROVED";
    const isPending = app.status === "PENDING";
    const isCancelled = app.status === "CANCELLED";

    return (
      <div className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 bg-card border border-border hover:border-primary/20 rounded-xl transition-colors shadow-sm">
        <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
          <div className={`size-10 rounded-full flex items-center justify-center shrink-0 border ${isApproved ? 'bg-green-500/10 border-green-500/20 text-green-600' : isPending ? 'bg-amber-500/10 border-amber-500/20 text-amber-600' : 'bg-destructive/10 border-destructive/20 text-destructive'}`}>
            {isApproved ? <CheckCircle2 className="size-5" /> : isPending ? <Clock className="size-5" /> : <XCircle className="size-5" />}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-semibold text-foreground text-base line-clamp-1 truncate">
                {app.propertyUnit?.property?.title || "Property Request"}
              </h3>
              <Badge 
                  className={`text-[10px] uppercase font-bold h-5 px-1.5 ${
                    isApproved ? "bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-500/20" :
                    isPending ? "bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 border-amber-500/20" :
                    "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20"
                  }`}
                >
                  {app.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground truncate flex items-center gap-1.5">
              <span>Unit {app.propertyUnit?.unitLabel || "N/A"}</span>
              <span className="size-1 bg-border rounded-full" />
              <span>{app.duration} {app.rentType === 'YEARLY' ? 'Yrs' : app.rentType === 'MONTHLY' ? 'Mos' : 'Units'}</span>
              <span className="size-1 bg-border rounded-full" />
              <span>Move-in {new Date(app.moveInDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pl-14 sm:pl-0 mt-2 sm:mt-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-border/50">
          <div className="text-left sm:text-right">
            <span className="font-semibold text-sm text-foreground block">
              ৳{Number(app.agreedAmount).toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground block">
               / {app.rentType?.toLowerCase()}
            </span>
          </div>
          <Button variant="secondary" size="sm" onClick={() => handleOpenDetails(app)} className="h-8 px-4 text-xs font-medium">
            Details
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground">My Rental Requests</h2>
        <p className="text-muted-foreground mt-1 text-sm">Track and manage your property applications.</p>
      </div>

      {applications.length > 0 ? (
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-3 max-w-[500px] h-12 p-1 bg-muted/50 rounded-xl">
            <TabsTrigger value="pending" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Pending ({pendingApps.length})</TabsTrigger>
            <TabsTrigger value="approved" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Approved ({approvedApps.length})</TabsTrigger>
            <TabsTrigger value="others" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Others ({otherApps.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
            {pendingApps.length > 0 ? (
              pendingApps.map((app) => <RequestCard key={app.id} app={app} />)
            ) : (
              <p className="text-muted-foreground text-sm py-4">No pending requests.</p>
            )}
          </TabsContent>
          <TabsContent value="approved" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
            {approvedApps.length > 0 ? (
              approvedApps.map((app) => <RequestCard key={app.id} app={app} />)
            ) : (
              <p className="text-muted-foreground text-sm py-4">No approved requests.</p>
            )}
          </TabsContent>
          <TabsContent value="others" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
             {otherApps.length > 0 ? (
              otherApps.map((app) => <RequestCard key={app.id} app={app} />)
            ) : (
              <p className="text-muted-foreground text-sm py-4">No other requests.</p>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="bg-gradient-to-b from-primary/5 to-transparent border border-primary/10 rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-5 shadow-sm">
          <div className="size-16 bg-background rounded-full flex items-center justify-center shadow-sm border border-border">
            <FileText className="size-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-heading font-bold text-foreground">No applications yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
              You haven't submitted any rental applications. Find a place you like and send your first request!
            </p>
          </div>
          <Link href="/properties">
            <Button className="mt-4 shadow-lg hover:shadow-xl transition-all h-12 px-8 text-base font-semibold rounded-xl">
              Browse Properties <ArrowRight className="ml-2 size-5" />
            </Button>
          </Link>
        </div>
      )}

      {/* Details Modal */}
      <ReusableModal
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        title="Request Details"
      >
        {selectedApp && (
          <div className="space-y-5">
             <div className="bg-muted/30 p-4 rounded-xl border border-border/50 space-y-3">
               <h4 className="font-semibold text-foreground text-base">
                 {selectedApp.propertyUnit?.property?.title || "Property"}
               </h4>
               <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                 <span className="text-muted-foreground flex items-center gap-1.5"><FileText className="size-4"/> {selectedApp.propertyUnit?.unitLabel}</span>
                 <span className="text-muted-foreground flex items-center gap-1.5"><Calendar className="size-4"/> {new Date(selectedApp.moveInDate).toLocaleDateString()}</span>
               </div>
             </div>

             <div className="space-y-3 px-1 text-sm">
               <div className="flex justify-between items-center py-2 border-b border-border/50">
                 <span className="text-muted-foreground font-medium">Status</span>
                 <Badge 
                   className={
                     selectedApp.status === "APPROVED" ? "bg-green-500/15 text-green-700 hover:bg-green-500/25 border-none" :
                     selectedApp.status === "PENDING" ? "bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 border-none" :
                     "bg-destructive/15 text-destructive hover:bg-destructive/25 border-none"
                   }
                 >
                   {selectedApp.status}
                 </Badge>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-border/50">
                 <span className="text-muted-foreground font-medium">Agreed Rent</span>
                 <span className="font-bold text-base">৳{Number(selectedApp.agreedAmount).toLocaleString()} <span className="text-xs text-muted-foreground font-normal">/ {selectedApp.rentType?.toLowerCase()}</span></span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-border/50">
                 <span className="text-muted-foreground font-medium">Duration</span>
                 <span className="font-medium">{selectedApp.duration} {selectedApp.rentType === 'YEARLY' ? 'Years' : selectedApp.rentType === 'MONTHLY' ? 'Months' : 'Units'}</span>
               </div>
             </div>

             {selectedApp.message && (
               <div className="px-1">
                 <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Your Message</span>
                 <p className="text-sm bg-muted/40 p-4 rounded-xl border border-border/50 leading-relaxed text-foreground whitespace-pre-wrap">
                   {selectedApp.message}
                 </p>
               </div>
             )}

             {selectedApp.landlordResponse && (
               <div className="px-1">
                 <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 block">Landlord Response</span>
                 <p className="text-sm bg-primary/5 p-4 rounded-xl border border-primary/20 leading-relaxed text-foreground whitespace-pre-wrap">
                   {selectedApp.landlordResponse}
                 </p>
               </div>
             )}
             
             <div className="pt-4 flex justify-end gap-3 px-1 mt-4">
               {selectedApp.status === "PENDING" && (
                 <Button variant="destructive" onClick={() => handleCancelRequest(selectedApp.id)} disabled={isCanceling} className="shadow-sm">
                   {isCanceling ? "Canceling..." : "Cancel Request"}
                 </Button>
               )}
               <Button variant="outline" onClick={() => setModalOpen(false)} className="shadow-sm">Close</Button>
             </div>
          </div>
        )}
      </ReusableModal>
    </div>
  );
}

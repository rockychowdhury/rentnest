import React from "react";
import { formatCurrency, formatRelativeTime } from "@/lib/utils/formatUtils";
import { Button } from "@/components/ui/button";
import { Download, Phone, Mail, Key, ShieldCheck, FileText, CalendarDays } from "lucide-react";

export function CurrentLeaseCard({ lease }: { lease: any }) {
  const { property, landlord, rentAmount, depositAmount, endDate } = lease;
  
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="flex flex-col md:flex-row">
        {/* Left Side: Property Image & Info */}
        <div className="w-full md:w-1/3 h-48 md:h-auto relative">
          <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
          <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md px-3 py-1 rounded-full border border-border text-xs font-semibold flex items-center gap-1.5 shadow-sm">
            <Key className="size-3.5 text-primary" /> Active Lease
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-heading font-bold text-foreground">{property.title}</h3>
              <p className="text-muted-foreground mt-1">{property.address}</p>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Rent Amount</p>
                  <p className="text-xl font-semibold text-foreground">৳{rentAmount.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">/ month</span></p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Lease Ends</p>
                  <p className="text-lg font-medium text-amber-600 flex items-center gap-1.5">
                    <CalendarDays className="size-4" /> {formatRelativeTime(endDate)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-muted/30 p-4 rounded-xl border border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Landlord Contact</p>
                <p className="font-medium text-foreground">{landlord.name}</p>
                <div className="flex gap-4 mt-2">
                  <a href={`tel:${landlord.phone}`} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Phone className="size-4" /> Call
                  </a>
                  <a href={`mailto:${landlord.email}`} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="size-4" /> Message
                  </a>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Deposit Paid</p>
                <p className="font-medium flex items-center gap-1.5 text-foreground">
                  <ShieldCheck className="size-4 text-emerald-500" /> ৳{depositAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-3">
            <Button variant="outline" className="shadow-sm">
              <Download className="size-4 mr-2 text-muted-foreground" /> Download Agreement
            </Button>
            <Button variant="secondary" className="shadow-sm bg-secondary hover:bg-secondary/80">
              Request Renewal
            </Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-destructive">
              Give Move-out Notice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Download, ArrowRight, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { formatCurrency } from "@/lib/utils/formatUtils";
import { format } from "date-fns";
import { CheckoutButton } from "@/components/payments/CheckoutButton";
import Link from "next/link";
import { CustomPagination } from "@/components/shared/pagination";

export function PaymentsClient({ paymentsData }: { paymentsData: { statementPayments: any[], pendingPayments: any[], pendingLeases: any[] } }) {
  const { statementPayments, pendingPayments, pendingLeases } = paymentsData;
  
  const dueItems = [
    ...(pendingLeases || []).map(l => ({
      id: l.id,
      type: 'LEASE_ACTIVATION',
      title: l.propertyUnit?.property?.title || "Property",
      amount: Number(l.agreedAmount || l.rentAmount || 0),
      actionUrl: `/tenant-dashboard/payments/pay/${l.id}`,
      subtitle: 'Lease Activation Required'
    })),
    ...(pendingPayments || []).map(p => ({
      id: p.id,
      type: 'RENT_PAYMENT',
      title: p.lease?.propertyUnit?.property?.title || p.lease?.property?.title || "Property Rent",
      amount: Number(p.amount),
      actionUrl: `/tenant-dashboard/payments/pay/${p.id}`,
      subtitle: 'Rent Payment Due'
    }))
  ];

  const [dueIndex, setDueIndex] = useState(0);
  const [statementPage, setStatementPage] = useState(1);
  const statementLimit = 5;

  const handleNextDue = () => {
    setDueIndex((prev) => (prev + 1) % dueItems.length);
  };
  const handlePrevDue = () => {
    setDueIndex((prev) => (prev - 1 + dueItems.length) % dueItems.length);
  };

  const currentDue = dueItems[dueIndex];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-heading font-semibold text-foreground">Payments</h2>
        <p className="text-muted-foreground mt-1">Manage your pending payments and download receipts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Mini Statement (Completed Payments) */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Mini Statement</h3>
          
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {statementPayments && statementPayments.length > 0 ? (
              <>
              <div className="divide-y divide-border/50">
                {statementPayments.slice((statementPage - 1) * statementLimit, statementPage * statementLimit).map((payment) => (
                  <div key={payment.id} className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-muted/10 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground">
                          {payment.lease?.propertyUnit?.property?.title || payment.lease?.property?.title || "Rent Payment"}
                        </h4>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          payment.status === 'COMPLETED' ? 'bg-green-500/10 text-green-600' :
                          payment.status === 'FAILED' ? 'bg-destructive/10 text-destructive' :
                          payment.status === 'REFUNDED' ? 'bg-orange-500/10 text-orange-600' :
                          payment.status === 'EXPIRED' ? 'bg-slate-500/10 text-slate-600' :
                          'bg-primary/10 text-primary'
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{format(new Date(payment.createdAt), "MMM d, yyyy")}</p>
                      <p className="text-xs text-muted-foreground mt-1 font-mono">Trx: {payment.transactionId || payment.id}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="font-semibold text-foreground">{formatCurrency(Number(payment.amount))}</span>
                      {payment.status === 'COMPLETED' && (
                        <Button variant="outline" size="sm" className="h-8 gap-2 w-full sm:w-auto">
                          <Download className="size-3.5" /> Receipt
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 pb-2">
                <CustomPagination
                  meta={{ page: statementPage, limit: statementLimit, total: statementPayments.length }}
                  onPageChange={(p) => setStatementPage(p)}
                />
              </div>
              </>
            ) : (
              <div className="p-8 flex flex-col items-center justify-center text-center space-y-3 min-h-[250px]">
                <FileText className="size-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground max-w-[250px]">No payments found in your statement.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pay Current Due */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-sm font-semibold text-destructive uppercase tracking-wider">Current Due</h3>
          
          <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6 relative overflow-hidden">
            {dueItems.length > 0 ? (
              <>
                {dueItems.length > 1 && (
                  <div className="absolute top-4 right-4 z-10 flex gap-1">
                    <Button variant="outline" size="icon" className="size-6 rounded-full h-6 w-6 border-destructive/30 text-destructive hover:bg-destructive/10" onClick={handlePrevDue}>
                      <ChevronLeft className="size-3" />
                    </Button>
                    <Button variant="outline" size="icon" className="size-6 rounded-full h-6 w-6 border-destructive/30 text-destructive hover:bg-destructive/10" onClick={handleNextDue}>
                      <ChevronRight className="size-3" />
                    </Button>
                  </div>
                )}
                
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-destructive/10 rounded-full flex items-center justify-center shrink-0">
                      <CreditCard className="size-5 text-destructive" />
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-destructive">{currentDue.subtitle}</h4>
                      <p className="text-xs text-destructive/80">Action needed</p>
                    </div>
                  </div>
                  
                  <div className="bg-background border border-destructive/10 rounded-xl p-4 mt-2">
                    <h5 className="font-medium text-sm text-foreground line-clamp-2 mb-1">{currentDue.title}</h5>
                    <div className="flex justify-between items-center my-4">
                       <span className="text-sm text-muted-foreground">Total Due:</span>
                       <span className="font-bold text-destructive text-lg">{formatCurrency(currentDue.amount)}</span>
                    </div>
                    
                    <CheckoutButton 
                       leaseId={currentDue.id} 
                       variant="destructive" 
                       className="w-full shadow-sm gap-2 mt-4"
                    >
                       Pay Now <ArrowRight className="size-4" />
                    </CheckoutButton>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-center space-y-3 py-6 opacity-70">
                <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <CreditCard className="size-6 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground text-sm">No Due Payments</h4>
                <p className="text-xs text-muted-foreground">You are all caught up on your rent!</p>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}

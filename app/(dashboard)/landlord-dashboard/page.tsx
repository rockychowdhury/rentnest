import React from "react";
import Link from "next/link";
import { Building, CreditCard, FileText, Key, Plus, ArrowUpRight, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { AnalyticsAreaChart } from "@/components/dashboard/AnalyticsAreaChart";
import { OccupancyDonutChart } from "@/components/dashboard/OccupancyDonutChart";
import { RecentActivityFeed, ActivityItem } from "@/components/dashboard/RecentActivityFeed";
import { getMyProperties } from "../_actions/propertiesActions";
import { getIncomingRentalRequests } from "../_actions/rentRequestActions";
import { getLandlordPayments } from "../_actions/paymentActions";
import type { Metadata } from "next";
import { Property, RentalRequest, Payment, PropertyUnit } from "@/types";

export const metadata: Metadata = {
  title: "Landlord Analytics & Overview | RentNest",
};

export default async function LandlordDashboardPage() {
  const [propertiesRes, requestsRes, paymentsRes] = await Promise.all([
    getMyProperties().catch(() => ({ success: false, data: [] })),
    getIncomingRentalRequests().catch(() => ({ success: false, data: [] })),
    getLandlordPayments().catch(() => ({ success: false, data: [] })),
  ]);

  const properties: Property[] = Array.isArray(propertiesRes.data) ? propertiesRes.data : [];
  const requests: RentalRequest[] = Array.isArray(requestsRes.data) ? requestsRes.data : [];
  const payments: Payment[] = Array.isArray(paymentsRes.data) ? paymentsRes.data : [];

  let totalUnits = 0;
  let occupiedUnits = 0;
  let availableUnits = 0;

  properties.forEach((p: Property) => {
    const units: PropertyUnit[] = p.units || [];
    totalUnits += p.totalUnits || units.length || 1;
    units.forEach((u: PropertyUnit) => {
      if ((u.status as string) === "RENTED" || u.status === "OCCUPIED") occupiedUnits++;
      else if (u.status === "AVAILABLE") availableUnits++;
    });
  });

  const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

  const pendingRequests = requests.filter((r: RentalRequest) => (r.status as string) === "PENDING");

  const completedPayments = payments.filter((p: Payment) => (p.status as string) === "COMPLETED" || (p as any).status === "SUCCESS");
  const totalIncome = completedPayments.reduce((sum: number, p: Payment) => sum + (Number(p.amount) || 0), 0);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  const incomeChartData = Array.from({ length: 6 }).map((_, i) => {
    const monthIdx = (currentMonth - 5 + i + 12) % 12;
    const name = monthNames[monthIdx];
    const monthIncome = payments
      .filter((p: Payment) => {
        const d = new Date(p.createdAt || Date.now());
        return d.getMonth() === monthIdx && ((p.status as string) === "COMPLETED" || (p as any).status === "SUCCESS");
      })
      .reduce((sum: number, p: Payment) => sum + (Number(p.amount) || 0), 0);

    return {
      name,
      value: monthIncome,
    };
  });

  const occupancyDonutData = [
    { name: "Occupied Units", value: occupiedUnits, color: "#10b981" },
    { name: "Available Units", value: availableUnits, color: "#3b82f6" },
  ];

  const recentActivities: ActivityItem[] = [
    ...requests.slice(0, 3).map((r: RentalRequest) => ({
      id: `req-${r.id}`,
      title: `Rental Request: ${r.tenant?.profile?.fullName || r.tenant?.email || 'Tenant'}`,
      description: `Requested unit ${r.propertyUnit?.unitLabel || ''} • Status: ${r.status}`,
      timestamp: r.createdAt || new Date().toISOString(),
      badge: r.status,
    })),
    ...payments.slice(0, 3).map((p: Payment) => ({
      id: `pay-${p.id}`,
      title: `Rent Payment Received: ৳${Number(p.amount).toLocaleString()}`,
      description: `Tenant payment via ${(p as any).paymentMethod || 'Online Transfer'}`,
      timestamp: p.createdAt || new Date().toISOString(),
      badge: p.status,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 6);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight text-foreground">
            Landlord Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track rental income, property occupancy, tenant applications, and payment receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/landlord-dashboard/requests">
            <Button size="sm" variant="outline" className="text-xs font-semibold gap-1.5">
              <FileText className="size-3.5 text-amber-500" />
              Requests ({pendingRequests.length})
            </Button>
          </Link>
          <Link href="/landlord-dashboard/properties/new">
            <Button size="sm" className="text-xs font-semibold gap-1.5 shadow-xs">
              <Plus className="size-3.5" />
              Add Property
            </Button>
          </Link>
        </div>
      </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Rental Income"
          value={`৳${totalIncome.toLocaleString()}`}
          subtext={`${completedPayments.length} payouts received`}
          iconName="creditCard"
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-500/10"
        />
        <StatCard
          title="Occupancy Rate"
          value={`${occupancyRate}%`}
          subtext={`${occupiedUnits} occupied / ${totalUnits || properties.length} units`}
          iconName="key"
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-500/10"
        />
        <StatCard
          title="My Properties"
          value={properties.length}
          subtext={`${properties.filter((p: any) => p.status === 'PUBLISHED').length} published listings`}
          iconName="building"
          iconColor="text-primary"
          iconBg="bg-primary/10"
        />
        <StatCard
          title="Pending Requests"
          value={pendingRequests.length}
          subtext="Requires your review"
          iconName="fileText"
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-500/10"
        />
      </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnalyticsAreaChart
            title="Rental Income Breakdown"
            description="Monthly rent collected across your rental properties"
            data={incomeChartData}
            primaryLabel="Income Collected"
          />
        </div>
        <div>
          <OccupancyDonutChart
            title="Unit Occupancy Ratio"
            description="Live occupancy across total units"
            data={occupancyDonutData}
            centerValue={`${occupancyRate}%`}
            centerLabel="Occupied"
          />
        </div>
      </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivityFeed
            title="Recent Rental Activity & Requests"
            description="Tenant applications and income payment log"
            activities={recentActivities}
          />
        </div>

                <Card className="border border-border/80 shadow-xs bg-card/60 backdrop-blur-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-heading font-bold text-foreground">
              Landlord Shortcuts
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Quick access to your portfolio controls
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <Link
              href="/landlord-dashboard/properties"
              className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/60 hover:bg-muted/80 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Building className="size-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">Manage Properties</span>
              </div>
              <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>

            <Link
              href="/landlord-dashboard/requests"
              className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/60 hover:bg-muted/80 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <FileText className="size-4 text-amber-500" />
                <span className="text-xs font-semibold text-foreground">Tenant Requests</span>
              </div>
              <span className="text-xs font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                {pendingRequests.length}
              </span>
            </Link>

            <Link
              href="/landlord-dashboard/leases"
              className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/60 hover:bg-muted/80 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Key className="size-4 text-emerald-500" />
                <span className="text-xs font-semibold text-foreground">Leases & Agreements</span>
              </div>
              <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>

            <Link
              href="/landlord-dashboard/payments"
              className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/60 hover:bg-muted/80 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="size-4 text-blue-500" />
                <span className="text-xs font-semibold text-foreground">Payout Statements</span>
              </div>
              <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

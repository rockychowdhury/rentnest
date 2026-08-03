import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Building, FileText, Heart, CreditCard, Clock, Key, ArrowUpRight, CheckCircle } from "lucide-react";
import { getTenantOverview } from "../_actions/tenantActions";
import { getTenantLeases } from "../_actions/tenantLease";
import { getTenantPayments } from "../_actions/tenantPayments";
import { formatRelativeTime } from "@/lib/utils/formatUtils";
import { LeaseOverviewClient } from "./lease-overview-client";
import { StatCard } from "@/components/dashboard/StatCard";
import { AnalyticsAreaChart } from "@/components/dashboard/AnalyticsAreaChart";
import { RecentActivityFeed, ActivityItem } from "@/components/dashboard/RecentActivityFeed";

export const metadata = {
  title: "Tenant Dashboard & Overview | RentNest",
};

export default async function TenantOverviewPage() {
  const [overviewRes, leasesRes, paymentsRes] = await Promise.all([
    getTenantOverview().catch(() => ({ success: false, data: { isPaymentDue: false, upcomingPayment: null, stats: { pendingApplications: 0, savedProperties: 0 }, recentActivity: [] } })),
    getTenantLeases().catch(() => ({ success: false, data: [] })),
    getTenantPayments().catch(() => ({ success: false, data: { statementPayments: [] } })),
  ]);

  const overviewData = overviewRes.data || { isPaymentDue: false, upcomingPayment: null, stats: { pendingApplications: 0, savedProperties: 0 }, recentActivity: [] };
  const { stats, recentActivity } = overviewData;
  const leases = Array.isArray(leasesRes.data) ? leasesRes.data : [];
  const payments = Array.isArray(paymentsRes?.data?.statementPayments) ? paymentsRes.data.statementPayments : [];

  const hasActiveLease = leases.some((l: any) => l.status === "ACTIVE" || l.status === "ACTIVE_LEASE");
  const totalRentPaid = payments.reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);

  // 6-Month Tenant Rent Expense Chart Data
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  const expenseChartData = Array.from({ length: 6 }).map((_, i) => {
    const monthIdx = (currentMonth - 5 + i + 12) % 12;
    const name = monthNames[monthIdx];
    const monthExpense = payments
      .filter((p: any) => {
        const d = new Date(p.createdAt || Date.now());
        return d.getMonth() === monthIdx && (p.status === "COMPLETED" || p.status === "SUCCESS");
      })
      .reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);

    return {
      name,
      value: monthExpense,
    };
  });

  // Recent Activity Items
  const activityFeedItems: ActivityItem[] = (recentActivity || []).map((act: any) => ({
    id: act.id || Math.random().toString(),
    title: act.title || "Rental Activity",
    description: act.description || "Status update on your application or lease",
    timestamp: act.date || new Date().toISOString(),
    badge: act.type === "APPLICATION_UPDATE" ? "Application" : "Lease",
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight text-foreground">
            Tenant Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your active lease, rent payments, applications, and saved rentals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/properties">
            <Button size="sm" className="text-xs font-semibold gap-1.5 shadow-xs">
              <Building className="size-3.5" />
              Browse Properties
            </Button>
          </Link>
        </div>
      </div>

      {/* Dominant Lease Overview Card */}
      <section>
        <LeaseOverviewClient leases={leases} />
      </section>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Rental Lease Status"
          value={hasActiveLease ? "Active" : "No Active Lease"}
          subtext={hasActiveLease ? "Current home rental active" : "Explore properties to rent"}
          iconName="key"
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-500/10"
        />
        <StatCard
          title="Pending Applications"
          value={stats.pendingApplications || 0}
          subtext="Under landlord review"
          iconName="fileText"
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-500/10"
        />
        <StatCard
          title="Saved Properties"
          value={stats.savedProperties || 0}
          subtext="Bookmarked listings"
          iconName="heart"
          iconColor="text-rose-600 dark:text-rose-400"
          iconBg="bg-rose-500/10"
        />
        <StatCard
          title="Total Rent Paid"
          value={`৳${totalRentPaid.toLocaleString()}`}
          subtext={`${payments.length} successful payments`}
          iconName="creditCard"
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-500/10"
        />
      </div>

      {/* Expense History Chart & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnalyticsAreaChart
            title="Rent Spending Breakdown"
            description="Monthly rent payments and security deposit history"
            data={expenseChartData}
            primaryLabel="Rent Paid"
          />
        </div>

        {/* Shortcuts */}
        <Card className="border border-border/80 shadow-xs bg-card/60 backdrop-blur-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-heading font-bold text-foreground">
              Tenant Shortcuts
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Quick access to your rental dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <Link
              href="/tenant-dashboard/lease"
              className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/60 hover:bg-muted/80 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Key className="size-4 text-emerald-500" />
                <span className="text-xs font-semibold text-foreground">My Lease Agreement</span>
              </div>
              <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>

            <Link
              href="/tenant-dashboard/applications"
              className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/60 hover:bg-muted/80 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <FileText className="size-4 text-amber-500" />
                <span className="text-xs font-semibold text-foreground">Rental Applications</span>
              </div>
              <span className="text-xs font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                {stats.pendingApplications || 0}
              </span>
            </Link>

            <Link
              href="/tenant-dashboard/payments"
              className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/60 hover:bg-muted/80 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="size-4 text-blue-500" />
                <span className="text-xs font-semibold text-foreground">Payment Statements</span>
              </div>
              <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>

            <Link
              href="/tenant-dashboard/favorites"
              className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/60 hover:bg-muted/80 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Heart className="size-4 text-rose-500" />
                <span className="text-xs font-semibold text-foreground">Saved Favorites</span>
              </div>
              <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline */}
      <RecentActivityFeed
        title="Application & Rental Activity Feed"
        description="Updates on lease signatures, rental request approvals, and payments"
        activities={activityFeedItems}
      />
    </div>
  );
}

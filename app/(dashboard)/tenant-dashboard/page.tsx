import React, { Suspense, cache } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building, FileText, Heart, CreditCard, Key, ArrowUpRight } from "lucide-react";
import { getTenantOverview } from "../_actions/tenantActions";
import { getTenantLeases } from "../_actions/tenantLease";
import { getTenantPayments } from "../_actions/tenantPayments";
import { LeaseOverviewClient } from "./lease-overview-client";
import { StatCard } from "@/components/dashboard/StatCard";
import { AnalyticsAreaChart } from "@/components/dashboard/AnalyticsAreaChart";
import { RecentActivityFeed, ActivityItem } from "@/components/dashboard/RecentActivityFeed";
import {
  StatCardsSkeleton,
  ChartPanelSkeleton,
  FeedSkeleton,
} from "@/components/dashboard/section-skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from "next";
import { Lease, Payment } from "@/types";

export const metadata: Metadata = {
  title: "Tenant Dashboard & Overview | RentNest",
};

// Request-memoized loaders: every Suspense zone below reads through these,
// so parallel zones share a single backend flight instead of refetching.
const loadOverview = cache(async () => {
  const res = await getTenantOverview().catch(() => ({ success: false, data: null }));
  return res.data || { isPaymentDue: false, upcomingPayment: null, stats: { pendingApplications: 0, savedProperties: 0 }, recentActivity: [] };
});

const loadLeases = cache(async () => {
  const res = await getTenantLeases().catch(() => ({ success: false, data: [] }));
  return (Array.isArray(res.data) ? res.data : []) as Lease[];
});

const loadPayments = cache(async () => {
  const res = await getTenantPayments().catch(() => ({ success: false, data: { statementPayments: [] } }));
  const data = res.data || { statementPayments: [] };
  return (Array.isArray(data.statementPayments) ? data.statementPayments : []) as Payment[];
});

export default function TenantOverviewPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Static shell — paints instantly on navigation */}
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

      <Suspense fallback={<Skeleton className="h-28 w-full rounded-xl" />}>
        <LeaseZone />
      </Suspense>

      <Suspense fallback={<StatCardsSkeleton />}>
        <StatsZone />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<ChartPanelSkeleton />}>
            <SpendingChartZone />
          </Suspense>
        </div>
        <ShortcutsCard />
      </div>

      <Suspense fallback={<FeedSkeleton />}>
        <ActivityZone />
      </Suspense>
    </div>
  );
}

async function LeaseZone() {
  const leases = await loadLeases();
  return (
    <section>
      <LeaseOverviewClient leases={leases} />
    </section>
  );
}

async function StatsZone() {
  const [overviewData, leases, payments] = await Promise.all([
    loadOverview(),
    loadLeases(),
    loadPayments(),
  ]);
  const stats = overviewData.stats || { pendingApplications: 0, savedProperties: 0 };
  const hasActiveLease = leases.some((l: Lease) => (l.status as string) === "ACTIVE" || (l.status as string) === "ACTIVE_LEASE");
  const totalRentPaid = payments.reduce((sum: number, p: Payment) => sum + (Number(p.amount) || 0), 0);

  return (
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
  );
}

async function SpendingChartZone() {
  const payments = await loadPayments();

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  const expenseChartData = Array.from({ length: 6 }).map((_, i) => {
    const monthIdx = (currentMonth - 5 + i + 12) % 12;
    const name = monthNames[monthIdx];
    const monthExpense = payments
      .filter((p: Payment) => {
        const d = new Date(p.createdAt || Date.now());
        return d.getMonth() === monthIdx && ((p.status as string) === "COMPLETED" || (p.status as string) === "SUCCESS");
      })
      .reduce((sum: number, p: Payment) => sum + (Number(p.amount) || 0), 0);

    return {
      name,
      value: monthExpense,
    };
  });

  return (
    <AnalyticsAreaChart
      title="Rent Spending Breakdown"
      description="Monthly rent payments and security deposit history"
      data={expenseChartData}
      primaryLabel="Rent Paid"
    />
  );
}

function ShortcutsCard() {
  return (
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
          <Suspense fallback={<Skeleton className="h-5 w-8 rounded-full" />}>
            <PendingCountBadge />
          </Suspense>
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
          href="/tenant-dashboard/saved-properties"
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
  );
}

async function PendingCountBadge() {
  const overviewData = await loadOverview();
  return (
    <span className="text-xs font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
      {overviewData.stats?.pendingApplications || 0}
    </span>
  );
}

async function ActivityZone() {
  const overviewData = await loadOverview();
  const recentActivity = overviewData.recentActivity || [];

  const activityFeedItems: ActivityItem[] = recentActivity.map((act: { id?: string; title?: string; description?: string; date?: string; type?: string }, index: number) => ({
    id: act.id || `activity-${index}-${act.date || "now"}`,
    title: act.title || "Rental Activity",
    description: act.description || "Status update on your application or lease",
    timestamp: act.date || new Date().toISOString(),
    badge: act.type === "APPLICATION_UPDATE" ? "Application" : "Lease",
  }));

  return (
    <RecentActivityFeed
      title="Application & Rental Activity Feed"
      description="Updates on lease signatures, rental request approvals, and payments"
      activities={activityFeedItems}
    />
  );
}

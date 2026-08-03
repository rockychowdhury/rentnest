import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building, FileText, Heart, CreditCard, Clock, CheckCircle, Key } from "lucide-react";
import { getTenantOverview } from "../_actions/tenantActions";
import { getTenantLeases } from "../_actions/tenantLease";
import { formatRelativeTime } from "@/lib/utils/formatUtils";
import { LeaseOverviewClient } from "./lease-overview-client";

export default async function TenantOverviewPage() {
  const [overviewRes, leasesRes] = await Promise.all([
    getTenantOverview(),
    getTenantLeases()
  ]);
  
  const { isPaymentDue, upcomingPayment, stats, recentActivity } = overviewRes.data;
  const leases = leasesRes.data || [];
  const hasActiveLease = leases.length > 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Zone 1: Dominant Priority Card */}
      <section>
        <h2 className="text-xl font-heading font-semibold text-foreground mb-4">Overview</h2>
        <LeaseOverviewClient leases={leases} />
      </section>

      {/* Zone 2: Status Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {hasActiveLease && (
          <Link href="/tenant-dashboard/rentals" className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors group">
            <Key className="size-5 text-primary mb-3" />
            <p className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">Active</p>
            <p className="text-xs text-muted-foreground mt-1">Current Lease</p>
          </Link>
        )}
        {stats.pendingApplications > 0 && (
          <Link href="/tenant-dashboard/applications" className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors group">
            <FileText className="size-5 text-amber-500 mb-3" />
            <p className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{stats.pendingApplications}</p>
            <p className="text-xs text-muted-foreground mt-1">Pending Applications</p>
          </Link>
        )}
        <Link href="/tenant-dashboard/favorites" className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors group">
          <Heart className="size-5 text-rose-500 mb-3" />
          <p className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{stats.savedProperties}</p>
          <p className="text-xs text-muted-foreground mt-1">Saved Properties</p>
        </Link>
      </section>

      {/* Zone 3: Recent Activity Feed */}
      <section>
        <h2 className="text-lg font-heading font-semibold text-foreground mb-4">Recent Activity</h2>
        {recentActivity.length > 0 ? (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {recentActivity.map((activity: any, idx: number) => (
              <div key={activity.id} className={`p-4 flex gap-4 ${idx !== recentActivity.length - 1 ? 'border-b border-border/50' : ''}`}>
                <div className="mt-1">
                  {activity.type === 'APPLICATION_UPDATE' ? <FileText className="size-5 text-primary" /> : <Clock className="size-5 text-muted-foreground" />}
                </div>
                <div>
                  <h4 className="font-medium text-sm text-foreground">{activity.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                  <p className="text-[10px] text-muted-foreground mt-2 font-medium">{formatRelativeTime(activity.date)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-card border border-border rounded-xl">
            <p className="text-muted-foreground text-sm">No recent activity.</p>
          </div>
        )}
      </section>

    </div>
  );
}

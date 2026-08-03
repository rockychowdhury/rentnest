import React from "react";
import Link from "next/link";
import { Users, Building, Activity, CreditCard, ArrowUpRight, ShieldCheck, Layers, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { AnalyticsAreaChart } from "@/components/dashboard/AnalyticsAreaChart";
import { OccupancyDonutChart } from "@/components/dashboard/OccupancyDonutChart";
import { RecentActivityFeed, ActivityItem } from "@/components/dashboard/RecentActivityFeed";
import { getAllUsers, getAllProperties, getAllLeases, getAllPayments } from "../_actions/adminActions";
import type { Metadata } from "next";
import { User, Property, Lease, Payment } from "@/types";

export const metadata: Metadata = {
  title: "Admin Overview & System Analytics | RentNest",
};

export default async function AdminDashboardPage() {
  const [usersRes, propertiesRes, leasesRes, paymentsRes] = await Promise.all([
    getAllUsers().catch(() => ({ success: false, data: [] })),
    getAllProperties().catch(() => ({ success: false, data: [] })),
    getAllLeases().catch(() => ({ success: false, data: [] })),
    getAllPayments().catch(() => ({ success: false, data: [] })),
  ]);

  const users: User[] = Array.isArray(usersRes.data) ? usersRes.data : (usersRes.data?.users || usersRes.data?.data || []);
  const properties: Property[] = Array.isArray(propertiesRes.data) ? propertiesRes.data : (propertiesRes.data?.data || []);
  const leases: Lease[] = Array.isArray(leasesRes.data) ? leasesRes.data : (leasesRes.data?.data || []);
  const payments: Payment[] = Array.isArray(paymentsRes.data) ? paymentsRes.data : (paymentsRes.data?.data || []);

  const tenantCount = users.filter((u: User) => u.role === "TENANT").length;
  const landlordCount = users.filter((u: User) => u.role === "LANDLORD").length;
  const adminCount = users.filter((u: User) => u.role === "ADMIN").length;
  const totalUsers = users.length || 0;

  const publishedProps = properties.filter((p: Property) => p.status === "PUBLISHED").length;
  const draftProps = properties.filter((p: Property) => p.status === "DRAFT").length;
  const inactiveProps = properties.filter((p: Property) => p.status === "INACTIVE").length;
  const totalProperties = properties.length || 0;

  const activeLeases = leases.filter((l: Lease) => l.status === "ACTIVE").length;
  const totalLeases = leases.length || 0;

  const completedPayments = payments.filter((p: Payment) => p.status === "COMPLETED" || (p as any).status === "SUCCESS");
  const totalRevenue = completedPayments.reduce((sum: number, p: Payment) => sum + (Number(p.amount) || 0), 0);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  const revenueChartData = Array.from({ length: 6 }).map((_, i) => {
    const monthIdx = (currentMonth - 5 + i + 12) % 12;
    const name = monthNames[monthIdx];
    const monthRevenue = payments
      .filter((p: Payment) => {
        const d = new Date(p.createdAt || Date.now());
        return d.getMonth() === monthIdx && (p.status === "COMPLETED" || (p as any).status === "SUCCESS");
      })
      .reduce((sum: number, p: Payment) => sum + (Number(p.amount) || 0), 0);

    return {
      name,
      value: monthRevenue,
    };
  });

  const userDonutData = [
    { name: "Tenants", value: tenantCount, color: "#3b82f6" },
    { name: "Landlords", value: landlordCount, color: "#10b981" },
    { name: "Admins", value: adminCount, color: "#e11d48" },
  ];

  const recentActivities: ActivityItem[] = [
    ...users.slice(0, 3).map((u: User) => ({
      id: `u-${u.id}`,
      title: `New User: ${u.profile?.fullName || u.email}`,
      description: `Registered as ${u.role} (${u.email})`,
      timestamp: u.createdAt || new Date().toISOString(),
      badge: u.role,
    })),
    ...payments.slice(0, 3).map((p: Payment) => ({
      id: `p-${p.id}`,
      title: `Payment: ৳${Number(p.amount).toLocaleString()}`,
      description: `Status: ${p.status} via ${(p as any).paymentMethod || 'SSLCommerz'}`,
      timestamp: p.createdAt || new Date().toISOString(),
      badge: p.status,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 6);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight text-foreground">
            System Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time analytics, user distribution, platform revenue, and live activity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin-dashboard/users">
            <Button size="sm" variant="outline" className="text-xs font-semibold gap-1.5">
              <Users className="size-3.5" />
              Users
            </Button>
          </Link>
          <Link href="/admin-dashboard/properties">
            <Button size="sm" className="text-xs font-semibold gap-1.5 shadow-xs">
              <Building className="size-3.5" />
              Properties
            </Button>
          </Link>
        </div>
      </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Platform Revenue"
          value={`৳${totalRevenue.toLocaleString()}`}
          subtext={`${completedPayments.length} completed payments`}
          iconName="creditCard"
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-500/10"
        />
        <StatCard
          title="Total Users"
          value={totalUsers}
          subtext={`${tenantCount} Tenants • ${landlordCount} Landlords`}
          iconName="users"
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-500/10"
        />
        <StatCard
          title="Listed Properties"
          value={totalProperties}
          subtext={`${publishedProps} Published • ${draftProps} Drafts`}
          iconName="building"
          iconColor="text-primary"
          iconBg="bg-primary/10"
        />
        <StatCard
          title="Active Leases"
          value={activeLeases}
          subtext={`Out of ${totalLeases} total leases`}
          iconName="activity"
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-500/10"
        />
      </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnalyticsAreaChart
            title="Revenue & Growth Trajectory"
            description="Monthly platform transaction revenue performance"
            data={revenueChartData}
            primaryLabel="Monthly Revenue"
          />
        </div>
        <div>
          <OccupancyDonutChart
            title="User Role Distribution"
            description="Active accounts by role"
            data={userDonutData}
            centerValue={totalUsers}
            centerLabel="Total Users"
          />
        </div>
      </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivityFeed
            title="Live System Activity Log"
            description="Recent user registrations and transaction history"
            activities={recentActivities}
          />
        </div>

                <Card className="border border-border/80 shadow-xs bg-card/60 backdrop-blur-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-heading font-bold text-foreground">
              Management Shortcuts
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Direct access to system administration modules
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <Link
              href="/admin-dashboard/users"
              className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/60 hover:bg-muted/80 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Users className="size-4 text-blue-500" />
                <span className="text-xs font-semibold text-foreground">User Management</span>
              </div>
              <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>

            <Link
              href="/admin-dashboard/properties"
              className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/60 hover:bg-muted/80 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Building className="size-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">Property Listings</span>
              </div>
              <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>

            <Link
              href="/admin-dashboard/categories"
              className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/60 hover:bg-muted/80 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Layers className="size-4 text-emerald-500" />
                <span className="text-xs font-semibold text-foreground">Categories & Amenities</span>
              </div>
              <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>

            <Link
              href="/admin-dashboard/leases"
              className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/60 hover:bg-muted/80 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <FileText className="size-4 text-amber-500" />
                <span className="text-xs font-semibold text-foreground">Lease Agreements</span>
              </div>
              <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

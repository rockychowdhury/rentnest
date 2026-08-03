import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Building, Activity, CreditCard } from "lucide-react";

export const metadata = {
  title: "Admin Dashboard | RentNest",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-2">
          Monitor the platform's key metrics and resource health.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">Manage Users</div>
            <p className="text-xs text-muted-foreground">Admins, Landlords, Tenants</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">Manage Portfolio</div>
            <p className="text-xs text-muted-foreground">Properties across the platform</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Leases</CardTitle>
            <Activity className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">Track Leases</div>
            <p className="text-xs text-muted-foreground">Monitor system-wide rentals</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
            <CreditCard className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">Payments</div>
            <p className="text-xs text-muted-foreground">All transaction history</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border shadow-sm bg-card/50 backdrop-blur-sm mt-6">
        <CardHeader>
          <CardTitle>Welcome to the Admin Dashboard</CardTitle>
          <CardDescription>
            Use the sidebar or mobile menu to navigate through system resources. You can manage Users, Properties, Amenities, Categories, and monitor all platform activity from a centralized view.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

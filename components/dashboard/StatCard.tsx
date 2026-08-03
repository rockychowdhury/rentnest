"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/shadcnUtils";

import { CreditCard, Users, Building, Activity, Key, FileText, Heart } from "lucide-react";

export type StatIconName = "creditCard" | "users" | "building" | "activity" | "key" | "fileText" | "heart";

const iconMap: Record<StatIconName, React.ElementType> = {
  creditCard: CreditCard,
  users: Users,
  building: Building,
  activity: Activity,
  key: Key,
  fileText: FileText,
  heart: Heart,
};

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  iconName: StatIconName;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  iconColor?: string;
  iconBg?: string;
}

export function StatCard({
  title,
  value,
  subtext,
  iconName,
  trend,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
}: StatCardProps) {
  const Icon = iconMap[iconName] || Activity;

  return (
    <Card className="border border-border/80 shadow-xs bg-card/60 backdrop-blur-md hover:border-primary/40 transition-all duration-200">
      <CardContent className="p-5 flex items-start justify-between">
        <div className="space-y-1.5 overflow-hidden pr-2">
          <p className="text-xs font-medium text-muted-foreground truncate">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold font-heading text-foreground tracking-tight">
              {value}
            </h3>
            {trend && (
              <span
                className={cn(
                  "text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0",
                  trend.isPositive
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                    : "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400"
                )}
              >
                {trend.isPositive ? "+" : ""}{trend.value}
              </span>
            )}
          </div>
          {subtext && (
            <p className="text-[11px] text-muted-foreground truncate font-normal">
              {subtext}
            </p>
          )}
        </div>

        <div className={cn("p-2.5 rounded-xl shrink-0 border border-border/40", iconBg)}>
          <Icon className={cn("size-5", iconColor)} />
        </div>
      </CardContent>
    </Card>
  );
}

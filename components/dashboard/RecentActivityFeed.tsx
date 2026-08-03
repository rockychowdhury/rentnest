"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/utils/formatUtils";
import { cn } from "@/lib/utils/shadcnUtils";

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type?: "payment" | "lease" | "request" | "user" | "property" | "review";
  badge?: string;
}

interface RecentActivityFeedProps {
  title?: string;
  description?: string;
  activities: ActivityItem[];
  emptyMessage?: string;
}

export function RecentActivityFeed({
  title = "Recent Activity",
  description = "Live system updates and transaction activity",
  activities,
  emptyMessage = "No recent activity to display.",
}: RecentActivityFeedProps) {
  return (
    <Card className="border border-border/80 shadow-xs bg-card/60 backdrop-blur-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-heading font-bold text-foreground">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-xs text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {activities.length > 0 ? (
          <div className="relative pl-4 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
            {activities.map((item) => (
              <div key={item.id} className="relative flex items-start gap-3 group">
                <span className="absolute -left-4 top-1 size-3 rounded-full border-2 border-background bg-primary ring-2 ring-primary/20 group-hover:scale-110 transition-transform" />
                <div className="flex-1 space-y-1 overflow-hidden">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {item.title}
                    </p>
                    {item.badge && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-[10px] font-medium text-muted-foreground/80">
                    {formatRelativeTime(item.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border/60">
            {emptyMessage}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

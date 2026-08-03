"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ChartDataPoint {
  name: string;
  value: number;
  secondaryValue?: number;
}

interface AnalyticsAreaChartProps {
  title: string;
  description?: string;
  data: ChartDataPoint[];
  primaryKey?: string;
  secondaryKey?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  formatValue?: (val: number) => string;
}

export function AnalyticsAreaChart({
  title,
  description,
  data,
  primaryKey = "value",
  secondaryKey,
  primaryLabel = "Amount",
  secondaryLabel,
  formatValue = (val) => `৳${val.toLocaleString()}`,
}: AnalyticsAreaChartProps) {
  return (
    <Card className="border border-border/80 shadow-xs bg-card/60 backdrop-blur-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-heading font-bold text-foreground">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-xs text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="primaryColorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e11d48" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#e11d48" stopOpacity={0.0} />
                </linearGradient>
                {secondaryKey && (
                  <linearGradient id="secondaryColorGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                )}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150,150,150,0.15)" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#888888" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#888888" }}
                tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : `${val}`)}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-popover/95 border border-border p-2.5 rounded-xl shadow-lg backdrop-blur-md text-xs space-y-1">
                        <p className="font-semibold text-foreground">{label}</p>
                        <p className="text-primary font-medium">
                          {primaryLabel}: {formatValue(payload[0].value as number)}
                        </p>
                        {payload[1] && secondaryLabel && (
                          <p className="text-blue-500 font-medium">
                            {secondaryLabel}: {formatValue(payload[1].value as number)}
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey={primaryKey}
                stroke="#e11d48"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#primaryColorGrad)"
              />
              {secondaryKey && (
                <Area
                  type="monotone"
                  dataKey={secondaryKey}
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#secondaryColorGrad)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

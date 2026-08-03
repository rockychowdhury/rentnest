"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface DonutItem {
  name: string;
  value: number;
  color: string;
}

interface OccupancyDonutChartProps {
  title: string;
  description?: string;
  data: DonutItem[];
  centerLabel?: string;
  centerValue?: string | number;
}

export function OccupancyDonutChart({
  title,
  description,
  data,
  centerLabel,
  centerValue,
}: OccupancyDonutChartProps) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card className="border border-border/80 shadow-xs bg-card/60 backdrop-blur-md flex flex-col justify-between">
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
      <CardContent className="pt-2 flex flex-col items-center">
        <div className="relative h-56 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as DonutItem;
                    const percent = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
                    return (
                      <div className="bg-popover/95 border border-border p-2 rounded-lg shadow-md text-xs font-medium backdrop-blur-md">
                        <span style={{ color: item.color }}>● {item.name}: </span>
                        <span className="font-bold text-foreground">{item.value} ({percent}%)</span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Label Overlay */}
          {(centerValue !== undefined || centerLabel) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              {centerValue !== undefined && (
                <span className="text-2xl font-bold font-heading text-foreground">
                  {centerValue}
                </span>
              )}
              {centerLabel && (
                <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
                  {centerLabel}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Legend Grid */}
        <div className="w-full grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-border/50 text-xs">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between px-2 py-1 rounded-md bg-muted/30">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-muted-foreground truncate">{item.name}</span>
              </div>
              <span className="font-semibold text-foreground shrink-0">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

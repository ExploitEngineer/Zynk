"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { useTokenStore } from "@/store/token-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect } from "react";

const chartConfig: ChartConfig = {
  desktop: {
    label: "Tokens Used",
    color: "var(--chart-2)",
  },
};

export function TokenUsageChart() {
  const { usageByDay, totalUsed, tokenLimit, currentPlan, fetchUsage } =
    useTokenStore();

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  const chartData =
    usageByDay.length > 0
      ? usageByDay.map((u) => ({
          day: u.day,
          desktop: u.tokens,
        }))
      : [{ day: "No Data", desktop: 0 }];

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle>Monthly Token Usage</CardTitle>
        <div className="text-muted-foreground mt-2 text-sm">
          Plan: <span className="font-medium">{currentPlan}</span> | Tokens
          used:{" "}
          <span className="text-foreground font-semibold">
            {totalUsed.toLocaleString()}
          </span>{" "}
          / {tokenLimit.toLocaleString()}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="desktop"
              type="monotone"
              stroke="url(#colorUv)"
              dot={false}
              strokeWidth={2}
              filter="url(#rainbow-line-glow)"
            />
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0B84CE" stopOpacity={0.8} />
                <stop offset="50%" stopColor="#7107C6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#D80155" stopOpacity={0.8} />
              </linearGradient>
              <filter
                id="rainbow-line-glow"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feGaussianBlur stdDeviation="10" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

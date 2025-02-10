"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Info, TrendingUp } from "lucide-react";
import { format } from "date-fns";

export default function KpChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchKpIndex = async () => {
      try {
        const response = await fetch(
          "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json"
        );
        const json = await response.json();

        const headers = json[0];
        const data = json.slice(1).map((row: any) => {
          return {
            time: format(new Date(row[0]), "MMM d, HH:mm"),
            kp: parseFloat(row[1]),
          };
        });

        setChartData(data);
      } catch (error) {
        console.error("Failed to fetch Kp Index data:", error);
      }
    };

    fetchKpIndex();
  }, []);

  const chartConfig = {
    kp: {
      label: "Kp Index",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <div>
      <Card className="mb-10 bg-transparent">
        <CardHeader>
          <div className="flex items-center gap-5">
            <Info className="h-8 w-8 text-primary" />
            <p>KP Index is directly corelated to the chance and activity of Auroras</p>
          </div>
        </CardHeader>
      </Card>
      <Card className="bg-transparent">
        <CardHeader>
          <CardTitle>Planetary Kp Index</CardTitle>
          <CardDescription>
            Real-time geomagnetic activity based on NOAA data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <AreaChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={true} />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={true}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="kp"
                type="natural"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.4}
                stroke="hsl(var(--chart-5))"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                Live Data from NOAA <TrendingUp className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                Updated every 3 hours
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

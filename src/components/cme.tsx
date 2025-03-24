"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Info, TrendingUp } from "lucide-react";

export default function CMEForecast() {
  const [chartData, setChartData] = useState([]);

  function getFormattedDate(daysAgo = 0) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  }

  useEffect(() => {
    const fetchCMEData = async () => {
      const startDate = getFormattedDate(7); // 7 days ago
      const endDate = getFormattedDate(0); // Today
      const apiKey = process.env.NEXT_PUBLIC_NASA_KEY;
      const apiUrl = `https://api.nasa.gov/DONKI/CME?startDate=${startDate}&endDate=${endDate}&api_key=${apiKey}`;

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Map and extract necessary fields from CME objects
        const formattedData = data
          .filter((cme: any) => cme.cmeAnalyses?.length > 0)
          .map((cme: any) => ({
            time: format(new Date(cme.submissionTime), "MMM d, HH:mm"), // Format time
            speed: cme.cmeAnalyses?.[0]?.speed || 0, // Extract speed from CME Analysis
          }));

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching CME data:", error);
      }
    };

    fetchCMEData();
  }, []);

  const chartConfig = {
    speed: {
      label: "Wind Speed (km/s)",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <div>
      <Card className="bg-transparent">
        <CardHeader>
          <CardTitle>Solar Wind Speed (CME)</CardTitle>
          <CardDescription>
            Wind speed from Coronal Mass Ejections (NASA Data)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
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
                dataKey="speed"
                type="natural"
                fill="rgba(255, 165, 0, 0.4)"
                stroke="rgb(255, 165, 0)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                Live Data from NASA <TrendingUp className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                Updated few times a day.
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
      <Card className="mb-10 bg-transparent mt-5">
        <CardHeader>
          <div className="flex items-center gap-5">
            <Info className="h-8 w-8 text-primary" />
            <p>CMEs can lead to strong auroras if directed towards Earth.</p>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}

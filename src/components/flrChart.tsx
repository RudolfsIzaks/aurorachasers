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

export default function FLRChart() {
  const [chartData, setChartData] = useState([]);

  function getFormattedDate(daysAgo = 0) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  }

  useEffect(() => {
    const fetchFLRData = async () => {
      const startDate = getFormattedDate(7); // 7 days ago
      const endDate = getFormattedDate(0); // Today
      const apiKey = "TqzY5OFvANlCb9P68UJkPsWFdJUHIld414ixkQTT"; // Replace with your NASA API key
      const apiUrl = `https://api.nasa.gov/DONKI/FLR?startDate=${startDate}&endDate=${endDate}&api_key=${apiKey}`;

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Map and extract necessary fields from FLR objects
        const formattedData = data.map((flare: any) => ({
          time: format(new Date(flare.peakTime), "MMM dd, HH:mm"), // Format peak time
          intensity: parseFlareIntensity(flare.classType), // Convert classType to numerical value
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching FLR data:", error);
      }
    };

    fetchFLRData();
  }, []);

  // Convert flare class (C, M, X) to numerical values
  function parseFlareIntensity(classType: string) {
    if (!classType) return 0;
    const type = classType.charAt(0);
    const value = parseFloat(classType.substring(1)) || 0;

    if (type === "C") return value; // C-class is low scale (1-9)
    if (type === "M") return value * 10; // M-class is stronger (10-90)
    if (type === "X") return value * 100; // X-class is extreme (100+)

    return 0; // Default case
  }

  const chartConfig = {
    intensity: {
      label: "Flare Intensity",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <div>
      <Card className="bg-transparent">
        <CardHeader>
          <CardTitle>Solar Flare Activity</CardTitle>
          <CardDescription>
            Intensity of solar flares detected (GOES-P data).
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
                dataKey="intensity"
                type="natural"
                fill="rgba(255, 0, 0, 0.4)" // Red fill for solar flares
                stroke="rgb(255, 0, 0)" // Red stroke for visibility
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                Live Solar Flare Data from NASA{" "}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                Updated a few times a day.
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
      <Card className="mb-10 bg-transparent mt-5">
        <CardHeader>
          <div className="flex items-center gap-5">
            <Info className="h-8 w-8 text-primary" />
            <p>
              Strong flares often precede solar storms that generate auroras.
            </p>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}

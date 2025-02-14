import KpChart from "@/components/kpChart";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default function AuroraMapPage() {
  return (
    <div className="md:mx-10 mx-5 flex justify-center">
      <div className="max-w-[1200px] mt-20">
        <p className="text-3xl font-bold">Aurora Forecasts</p>
        <div className="grid gap-10 md:grid-cols-2 grid-cols-1 mt-5">
          <Card className="max-w-md bg-transparent">
            <CardHeader>
              <CardTitle className="flex gap-3 items-center">
                Northern Hemisphere
                <Badge variant="outline" className="p-2 px-3">
                  Live{" "}
                  <span className="ml-2 relative flex size-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex size-3 rounded-full bg-primary"></span>
                  </span>
                </Badge>
              </CardTitle>
              <CardDescription>
                Aurora forecast in the coming 30 minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                src="https://services.swpc.noaa.gov/images/animations/ovation/north/latest.jpg"
                alt="Aurora Forecast"
                width={400}
                height={400}
                priority
                className="rounded"
              />
            </CardContent>
          </Card>
          <Card className="max-w-md bg-transparent">
            <CardHeader>
              <CardTitle className="flex gap-3 items-center">
                Southern Hemisphere
                <Badge variant="outline" className="p-2 px-3">
                  Live{" "}
                  <span className="ml-2 relative flex size-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex size-3 rounded-full bg-primary"></span>
                  </span>
                </Badge>
              </CardTitle>
              <CardDescription>
                Aurora forecast in the coming 30 minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                src="https://services.swpc.noaa.gov/images/animations/ovation/south/latest.jpg"
                alt="Aurora Forecast"
                width={400}
                height={400}
                priority
                className="rounded"
              />
            </CardContent>
          </Card>
          <div className="md:col-span-2 mb-10">
            <KpChart />
          </div>
        </div>
      </div>
    </div>
  );
}

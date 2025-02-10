import CMEForecast from "@/components/cme";
import FLRChart from "@/components/flrChart";

export default function AuroraMapPage() {
  return (
    <div className="mx-10 flex justify-center">
      <div className="max-w-[1200px] mt-20">
        <p className="text-3xl font-bold">Solar Activity</p>
        <div className="grid gap-10 grid-cols-2 mt-5">
          <CMEForecast />
          <FLRChart />
        </div>
      </div>
    </div>
  );
}

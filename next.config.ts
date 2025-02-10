import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "services.swpc.noaa.gov",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_NASA_KEY: process.env.NEXT_PUBLIC_NASA_KEY,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ["@supabase/supabase-js"],
  images: {
    unoptimized: false,
  },
};

export default nextConfig;

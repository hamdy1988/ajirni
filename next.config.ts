import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: "https://supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "sb_publishable_pfy0B-Q4ZpLd_FegI0kZqQ_7N9Cyw6B",
  },
};

export default nextConfig;


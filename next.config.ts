import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: "https://supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "ضع_هنا_المفتاح_الطويل_الذي_يبدأ_بـ_eyJ",
  },
};

export default nextConfig;

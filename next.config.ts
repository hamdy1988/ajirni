import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: "https://hjabnujkrsrjasiqbttl.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqYWJudWprcnNyamFzaXFidHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUxMDk5MDUsImV4cCI6MjExMDY4NTkwNX0.gLnwsIvNMcJR5y3tjBPRO1btf3iSCBWArjftqnrxSbc",
  },
};

export default nextConfig;

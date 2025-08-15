import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env:{
    API_TOKEN:process.env.API_TOKEN
  },
  eslint:{
    ignoreDuringBuilds:true
  }
};

export default nextConfig;

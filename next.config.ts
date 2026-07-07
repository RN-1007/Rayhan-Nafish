import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow external IPs (like your mobile phone) to connect to Hot Module Replacement
  // @ts-ignore
  allowedDevOrigins: ['192.168.1.131'],
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow cross-origin dev requests
  // @ts-ignore
  allowedDevOrigins: ['localhost', '127.0.0.1', '172.20.10.5'],
  serverExternalPackages: ['pdf-parse'],
};

export default nextConfig;

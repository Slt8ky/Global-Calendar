import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  logging: { browserToTerminal: true },
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    unoptimized: true
  },
  allowedDevOrigins: [
    "localhost",
    "slt8ky.mooo.com"
  ]
};

export default nextConfig;

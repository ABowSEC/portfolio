import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export so the site can be hosted on GitHub Pages / any static host
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;

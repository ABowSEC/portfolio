import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export so the site can be hosted on GitHub Pages / any static host
  output: "export",
  images: { unoptimized: true },
  // Dev only: let the dev server be opened from its LAN address as well as localhost.
  allowedDevOrigins: ["192.168.56.1"],
};

export default nextConfig;

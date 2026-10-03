import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
        pathname: "/692da314a371a5db7e2d27f2/**",
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "freaksofnature.com",
        pathname: "/cdn/shop/**",
      },
      {
        protocol: "https",
        hostname: "humblebrands.com",
        pathname: "/cdn/shop/**",
      },
      {
        protocol: "https",
        hostname: "moonjuice.com",
        pathname: "/cdn/shop/**",
      },
    ],
  },
};

export default nextConfig;

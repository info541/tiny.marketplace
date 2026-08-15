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
      {
        protocol: "https",
        hostname: "www.tomsofmaine.com",
        pathname: "/cdn/shop/**",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
      {
        protocol: "https",
        hostname: "images.openbeautyfacts.org",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "schmidts-assets.nyc3.cdn.digitaloceanspaces.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;

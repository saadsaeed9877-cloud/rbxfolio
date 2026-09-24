import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
let apiOrigin = "http://localhost:3001";

try {
  apiOrigin = new URL(apiUrl).origin;
} catch {
  // If URL is invalid, use default origin
  console.warn(`Invalid NEXT_PUBLIC_API_URL: ${apiUrl}, using default: ${apiOrigin}`);
}

const nextConfig: NextConfig = {
  transpilePackages: ["@rbxfolio/types", "@rbxfolio/config", "@rbxfolio/database"],
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "3001", pathname: "/uploads/**" },
      { protocol: "https", hostname: "**" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiOrigin}/api/v1/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${apiOrigin}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;

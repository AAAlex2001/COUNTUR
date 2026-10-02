import type { NextConfig } from "next";

const backendOrigin = (process.env.API_INTERNAL_URL ?? "http://127.0.0.1:8000/api").replace(
  /\/api$/,
  "",
);

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${backendOrigin}/api/:path*` },
      { source: "/media/:path*", destination: `${backendOrigin}/media/:path*` },
    ];
  },
};

export default nextConfig;

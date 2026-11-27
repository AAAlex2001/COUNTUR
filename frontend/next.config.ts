import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseEnv } from "node:util";
import type { NextConfig } from "next";

/** Читает адреса сайта и API из общего .env при запуске Next.js из рабочей копии. */
function loadSiteUrls() {
  const path = resolve(__dirname, "../.env");
  if (!existsSync(path)) return;

  const settings = parseEnv(readFileSync(path, "utf8"));
  if (settings.SITE_URL) process.env.NEXT_PUBLIC_SITE_URL ??= settings.SITE_URL;
  if (settings.NEXT_PUBLIC_API_URL) process.env.NEXT_PUBLIC_API_URL ??= settings.NEXT_PUBLIC_API_URL;
  if (settings.API_INTERNAL_URL) process.env.API_INTERNAL_URL ??= settings.API_INTERNAL_URL;
}

loadSiteUrls();

const backendOrigin = (process.env.API_INTERNAL_URL ?? "http://127.0.0.1:8000/api").replace(
  /\/api$/,
  "",
);

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${backendOrigin}/api/:path*` },
      { source: "/media/:path*", destination: `${backendOrigin}/media/:path*` },
    ];
  },
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
    ];
  },
};

export default nextConfig;

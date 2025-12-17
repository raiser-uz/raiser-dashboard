import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  typedRoutes: true,
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js, *.jsx, *.ts, *.tsx",
      },
    },
  },
}

export default nextConfig

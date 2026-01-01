import type { NextConfig } from "next"

import createNextIntlPlugin from "next-intl/plugin"

const nextConfig: NextConfig = {
  typedRoutes: true,
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js, *.jsx, *.ts, *.tsx",
      },
    },
  },
  rewrites: async () => {
    console.log("WAREHOUSE_BACK_API_URL:", process.env.WAREHOUSE_BACK_API_URL)
    return [
      {
        source: "/api/warehouse-api/:path*",
        destination: `${process.env.WAREHOUSE_BACK_API_URL}/:path*`,
      },
    ]
  },
}

const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)

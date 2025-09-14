import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img4.momoshop.com.tw",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // 啟用靜態導出和優化
  output: "standalone", // 生產環境優化
  experimental: {
    optimizePackageImports: ["@heroicons/react"],
  },
  // 設定重新驗證
  async headers() {
    return [
      {
        source: "/page/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

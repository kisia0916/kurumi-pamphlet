import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xrsvucyppaxvudgfnmdx.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // 型エラー回避のため any にキャスト
  experimental: {
    allowedDevOrigins: ["https://42d6b645d44f.ngrok-free.app"] as any,
  } as any,
};

export default nextConfig;
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const imageHostnames = (process.env.NEXT_IMAGE_HOSTNAMES ?? "")
  .split(",")
  .map((hostname) => hostname.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: imageHostnames.map((hostname) => ({
      protocol: "https",
      hostname,
      port: "",
      pathname: "/storage/v1/object/public/**",
    })),
  },

  // Vercel などの本番ビルドで ESLint エラーにより失敗しないようにする
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 開発時のみ実験的オプションを有効化（本番ビルドでは含めない）
  ...(isProd
    ? {}
    : ({
        experimental: {
          // ngrok 等の開発用オリジン許可
          allowedDevOrigins: ["https://42d6b645d44f.ngrok-free.app"] as any,
        } as any,
      } as NextConfig)),
};

export default nextConfig;
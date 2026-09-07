import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  typedRoutes: true,
  async redirects() {
    return [
      {
        destination: "/moebel-sortiment",
        permanent: true,
        source: "/shop",
      },
      {
        destination: "/produkt/:productId",
        permanent: true,
        source: "/product/:productId",
      },
    ];
  },
};

export default nextConfig;

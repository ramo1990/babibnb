import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images : {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8001", // important si ton backend tourne sur ce port
        pathname: "/media/**", // autorise toutes les images
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com', // si tu utilises Google Auth ou images Google
        pathname: "/**",
      },
    ]
  }
};

export default nextConfig;

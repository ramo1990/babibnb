import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images : {
    remotePatterns: [
      // Django media
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8001", // important si ton backend tourne sur ce port
        pathname: "/media/**", // autorise toutes les images
      },

      // Google OAuth avatars
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com', // si tu utilises Google Auth ou images Google
        pathname: "/**",
      },

      // Facebook OAuth avatars
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
        pathname: "/**",
      },

      // AWS S3 Bucket
      {
        protocol: "https",
        hostname: "my-airbnb-clone-uploads.s3.us-east-1.amazonaws.com",
        pathname: "/**",
      },
    ]
  }
};

export default nextConfig;

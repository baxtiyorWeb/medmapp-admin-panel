import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "medmapp.uz",
        port: "",
        pathname: "/images/**",
      },
      // {
      //       protocol: "https",
      //       hostname: "raw.githubusercontent.com",
      //       port: "",
      //       pathname: "/ai-med/gemini-generative-ai/main/**",
      //     },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      //     {
      //       protocol: "http",
      //       hostname: "127.0.0.1",
      //       port: "5500",
      //       pathname: "/images/**",
      // },
      {
        protocol: "https",
        hostname: "medmapp.netlify.app",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

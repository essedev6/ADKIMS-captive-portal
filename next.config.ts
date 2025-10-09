import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com', 'localhost'], // Add your image domains here
  },
  async redirects() {
    return [
      {
        source: '/template-plans/outdoor',
        destination: '/plans/outdoor',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
  },
  images: {
    domains: ['localhost']
  },
  async rewrites() {
    return [
      {
        source: '/template-plans/:type',
        destination: '/template-plans/:type/',
        locale: false,
      }
    ];
  }
};

module.exports = nextConfig;
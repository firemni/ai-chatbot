/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['ai'],
  async rewrites() {
    return [
      {
        source: '/api/chat',
        destination: '/api/chat',
      },
    ];
  },
}

module.exports = nextConfig
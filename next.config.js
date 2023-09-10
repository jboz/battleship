/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { appDir: true, serverActions: true },
  output: 'standalone'
};

module.exports = nextConfig;

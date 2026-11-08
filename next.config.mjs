/** @type {import('next').NextConfig} */
const nextConfig = {
  // dev 与 build 使用不同产出目录，避免本地 next dev 运行中被 next build 覆盖而报 500
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  output: process.env.DOCKER_BUILD === 'true' ? 'standalone' : undefined,
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

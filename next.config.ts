/** @type {import('next').NextConfig} */
const nextConfig = {
  // Desactivamos Turbopack (es experimental y tiene bugs)
  experimental: {
    turbopack: false,
  },
};

export default nextConfig;
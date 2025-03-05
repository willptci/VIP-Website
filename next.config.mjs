/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'], // Add Firebase Storage domain here
  },
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint warnings/errors during builds
  },
};

export default nextConfig;
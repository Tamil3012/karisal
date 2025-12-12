/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  // ⭐ Required for Cloudflare Pages
  output: "standalone",

  // ⭐ Disable Turbopack in production (otherwise `.vercel/output` won't be created)
  experimental: {
    turbo: false,
  },
};

export default nextConfig;

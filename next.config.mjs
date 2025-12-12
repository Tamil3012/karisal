/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  // ⭐ DO NOT use "standalone" for @cloudflare/next-on-pages
  // Remove this line completely - standalone is incompatible with Cloudflare adapter
  // output: "standalone",

  experimental: {
    turbo: false,
  },
};

export default nextConfig;

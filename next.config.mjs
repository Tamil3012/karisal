/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",  // Essential for full features + API routes on Workers

  images: {
    unoptimized: true,  // Use Cloudflare Images if needed later
  },
};

export default nextConfig;
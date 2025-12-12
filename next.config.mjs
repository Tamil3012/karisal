/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",  // Essential for API routes on Workers

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
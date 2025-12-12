import { withCloudflare } from "@cloudflare/next-on-pages/next";

export default withCloudflare({
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
});

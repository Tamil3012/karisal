import withOpenNext from "@opennextjs/cloudflare";

export default withOpenNext({
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

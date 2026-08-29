/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export — the whole app is client-rendered (no server
  // components, no route handlers), so `next build` emits a plain `out/`
  // directory that Cloudflare Pages serves straight off its CDN. No Node
  // server, no SSR adapter, nothing to cold-start.
  output: "export",

  // The static export can't run Next's image optimizer, so images are
  // served as-authored.
  images: { unoptimized: true },
};

module.exports = nextConfig;

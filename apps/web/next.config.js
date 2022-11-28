/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  // productionBrowserSourceMaps: true,
  pageExtensions: ['p.tsx', 'p.ts', 'p.jsx', 'p.js'],
  experimental: {
    transpilePackages: ['ui', 'mdore'],
  },
  images: {
    domains: ['mmbiz.qpic.cn'],
  },
  rewrites: async function () {
    return [
      {
        source: '/articles',
        destination: '/articles/page/1',
      },
      {
        source: '/tags',
        destination: '/tags/page/1',
      },
      {
        source: '/topics',
        destination: '/topics/page/1',
      },
      {
        source: '/projects',
        destination: '/projects/page/1',
      },
      {
        source: '/admin/:match*',
        destination: 'https://aore.vercel.app/:match*',
      },
    ];
  },
};

module.exports = nextConfig;

import { fileURLToPath } from 'node:url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: fileURLToPath(new URL('.', import.meta.url)),
  },
  reactCompiler: true,
  experimental: {
    useSkewCookie: true,
    staleTimes: {
      dynamic: 0,
      static: 30,
    },
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://elfsightcdn.com https://*.elfsight.com; style-src 'self' 'unsafe-inline' https://elfsightcdn.com https://*.elfsight.com; font-src 'self' data: https://*.elfsight.com; img-src 'self' data: blob: https: https://*.instagram.com https://*.cdninstagram.com; media-src 'self' https://*.elfsightcdn.com https://*.elfsight.com https://*.cdninstagram.com https://scontent.cdninstagram.com blob: data:; connect-src 'self' https: https://*.elfsight.com; frame-src https://elfsight.com https://*.elfsight.com https://elfsightcdn.com https://www.instagram.com https://*.instagram.com; frame-ancestors 'none';",
          },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/:path((?!_next|api|favicon.ico).*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate, s-maxage=300, stale-while-revalidate=600' },
        ],
      },
    ];
  },
};

export default nextConfig;
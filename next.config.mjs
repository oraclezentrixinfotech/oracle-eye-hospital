/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: false,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "oracleeyehospital.com",
          },
        ],
        destination: "https://www.oracleeyehospital.com/:path*",
        permanent: true,
      },
      {
        source: "/login",
        destination: "/admin/login",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/sitemap.xml",
          destination: "/api/sitemap",
        },
      ],
    };
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};
export default nextConfig;

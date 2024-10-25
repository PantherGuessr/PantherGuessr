/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: process.env.NEXT_PUBLIC_CONVEX_URL.replace(/^https?:\/\//, ''),
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'img.clerk.com',
            }
        ],
    },
};

export default nextConfig;

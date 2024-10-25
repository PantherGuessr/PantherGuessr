/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'img.clerk.com'
        ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: process.env.NEXT_PUBLIC_CONVEX_URL.replace(/^https?:\/\//, ''),
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;

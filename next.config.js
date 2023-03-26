/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    env: {
        NEXT_PUBLIC_AUTO_SET_KEY: true,
    },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    env: {
        NEXT_PUBLIC_AUTO_SET_KEY: false,
        NEXT_PUBLIC_GTAG: `G-5FYMEWRZZ7`,
    },
};

module.exports = nextConfig;

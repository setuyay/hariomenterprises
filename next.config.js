/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  // Allow testing the dev server from phones/tablets on the local network.
  // Add any other LAN IPs you use here.
  allowedDevOrigins: ['192.168.6.122'],
};
module.exports = nextConfig;

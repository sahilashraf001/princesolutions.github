import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // Removed for production builds on Vercel to catch errors
  // typescript: {
  //   ignoreBuildErrors: true, // This should be false or removed for production
  // },
  // eslint: {
  //   ignoreDuringBuilds: true, // This should be false or removed for production
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'img.icons8.com',
        port: '',
        pathname: '/**',
      },
      // Allow images from github user attachments
      {
        protocol: 'https',
        hostname: 'user-images.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/user-attachments/assets/**',
      },
    ],
  },
};

export default nextConfig;

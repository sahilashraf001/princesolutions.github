
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // Ensure TypeScript and ESLint errors are caught during Vercel builds
  // typescript: {
  //   ignoreBuildErrors: false, // Default is false
  // },
  // eslint: {
  //   ignoreDuringBuilds: false, // Default is false
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


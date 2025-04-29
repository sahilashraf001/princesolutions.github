import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a fallback/example
import './globals.css';
import { MainLayout } from '@/components/layout/main-layout';
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from '@/context/cart-context'; // Import CartProvider

// If using Geist fonts, uncomment these lines and install the package:
// import { GeistSans } from 'geist/font/sans';
// import { GeistMono } from 'geist/font/mono';
// const geistSans = GeistSans; // Assign directly if using variable fonts
// const geistMono = GeistMono; // Assign directly if using variable fonts

// Using Inter font as a placeholder if Geist is not set up
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Prince Solutions Online',
  description: 'IT & Security Solutions with E-commerce Store',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Apply font variables if using Geist: ${geistSans.variable} ${geistMono.variable}
    <html lang="en" className={`${inter.variable} font-sans`} suppressHydrationWarning>
      <body
        className={`antialiased`} // Removed font classes here as they are on <html>
        suppressHydrationWarning // Suppress hydration warnings specifically on the body tag
      >
        <CartProvider> {/* Wrap with CartProvider */}
          <MainLayout>{children}</MainLayout>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}

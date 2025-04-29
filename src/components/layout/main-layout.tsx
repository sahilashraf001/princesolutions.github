'use client';

import React, { useEffect } from 'react';
import Header from './header';
import Footer from './footer';

export function MainLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Ensures scroll to top on page load/refresh
    window.scrollTo(0, 0);

    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

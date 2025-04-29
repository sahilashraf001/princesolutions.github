'use client';

import React from 'react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
      <p>© {new Date().getFullYear()} Prince Solutions. All rights reserved.</p>
      <button onClick={scrollToTop} className="text-accent hover:underline">
        Back to top
      </button>
    </footer>
  );
};

export default Footer;

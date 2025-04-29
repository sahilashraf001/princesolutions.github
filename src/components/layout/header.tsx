'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context'; // Import useCart
import { Badge } from '@/components/ui/badge'; // Import Badge

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false); // State to track client-side rendering
  const router = useRouter();
  const sheetRef = useRef<HTMLDivElement>(null);
  const { itemCount } = useCart(); // Get itemCount from cart context

  useEffect(() => {
    setIsClient(true); // Set to true once component mounts on client
  }, []);


  const reloadAndScroll = (path: string = '/') => {
    if (path === '/') {
       if (window.location.pathname === '/') {
         window.location.reload();
       } else {
         router.push('/');
         // Ensure scroll after navigation
         setTimeout(() => window.scrollTo(0, 0), 0);
       }
    } else {
      router.push(path);
      // Ensure scroll after navigation
      setTimeout(() => window.scrollTo(0, 0), 0);
    }
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
  };

   const navigateToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If not on the home page, navigate to home and then scroll
      router.push('/');
      setTimeout(() => {
        const homeElement = document.getElementById(sectionId);
        homeElement?.scrollIntoView({ behavior: 'smooth' });
      }, 100); // Delay to allow navigation
    }
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
  };


  return (
    <header className="header-gradient text-white sticky top-0 z-50 flex justify-between items-center p-5 shadow-lg animate-headerAnim">
      <div className="flex items-center space-x-4">
        <Link href="/" passHref>
          <div className="flex items-center cursor-pointer group overflow-hidden relative">
            <Image
              src="https://github.com/user-attachments/assets/909c75cd-2514-403a-8870-fb8a21468f3d"
              alt="Prince Solutions Logo"
              width={70}
              height={70}
              className="transition-all duration-500 ease-in-out group-hover:rotate-[15deg] group-hover:scale-110"
            />
            <div className="text-2xl font-bold uppercase tracking-wider ml-4 text-shadow animate-logoTextAnim whitespace-nowrap">
              Prince Solutions
            </div>
          </div>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        <button onClick={() => reloadAndScroll('/')} className="text-white uppercase text-sm tracking-wide relative group pb-2">
          Home
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
        </button>
        <Link href="/services" passHref>
          <span className="text-white uppercase text-sm tracking-wide relative group pb-2 cursor-pointer">
            Services
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
          </span>
        </Link>
        <Link href="/solutions" passHref>
         <span className="text-white uppercase text-sm tracking-wide relative group pb-2 cursor-pointer">
            Solutions
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
          </span>
        </Link>
        <button onClick={() => navigateToSection('about')} className="text-white uppercase text-sm tracking-wide relative group pb-2">
          About Us
           <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
        </button>
        <button onClick={() => navigateToSection('contact')} className="text-white uppercase text-sm tracking-wide relative group pb-2">
          Contact Us
           <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
        </button>
         <Link href="/store" passHref>
           <span className="text-white uppercase text-sm tracking-wide relative group pb-2 cursor-pointer">
            Store
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
           </span>
        </Link>
        <Link href="/cart" passHref>
          <Button variant="ghost" size="icon" className="text-white hover:text-accent relative">
            <ShoppingCart />
             {isClient && itemCount > 0 && ( // Only render badge on client and if items exist
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {itemCount}
              </Badge>
            )}
          </Button>
        </Link>
        <Link href="/auth" passHref>
          <Button variant="ghost" size="icon" className="text-white hover:text-accent">
            <User />
          </Button>
        </Link>
      </nav>

      {/* Mobile Navigation Trigger */}
      <div className="md:hidden flex items-center">
          <Link href="/cart" passHref>
            <Button variant="ghost" size="icon" className="text-white hover:text-accent mr-2 relative">
              <ShoppingCart />
               {isClient && itemCount > 0 && ( // Only render badge on client and if items exist
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
               <Button variant="ghost" size="icon" className="text-white hover:text-accent transition-transform duration-300 ease-in-out hover:rotate-90">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black bg-opacity-90 text-white p-0 w-[250px]" ref={sheetRef}>
              <div className="flex flex-col items-center justify-center h-full space-y-8">
                 <SheetClose asChild>
                    <Button variant="ghost" className="absolute top-4 right-4 text-white">
                        <X size={24} />
                    </Button>
                  </SheetClose>
                <button onClick={() => reloadAndScroll('/')} className="text-xl uppercase tracking-wider hover:text-accent">Home</button>
                <Link href="/services" passHref><span onClick={() => setIsMobileMenuOpen(false)} className="text-xl uppercase tracking-wider hover:text-accent cursor-pointer">Services</span></Link>
                <Link href="/solutions" passHref><span onClick={() => setIsMobileMenuOpen(false)} className="text-xl uppercase tracking-wider hover:text-accent cursor-pointer">Solutions</span></Link>
                 <button onClick={() => navigateToSection('about')} className="text-xl uppercase tracking-wider hover:text-accent">About Us</button>
                <button onClick={() => navigateToSection('contact')} className="text-xl uppercase tracking-wider hover:text-accent">Contact Us</button>
                <Link href="/store" passHref><span onClick={() => setIsMobileMenuOpen(false)} className="text-xl uppercase tracking-wider hover:text-accent cursor-pointer">Store</span></Link>
                <Link href="/auth" passHref><span onClick={() => setIsMobileMenuOpen(false)} className="text-xl uppercase tracking-wider hover:text-accent cursor-pointer">Login/Sign Up</span></Link>
              </div>
            </SheetContent>
          </Sheet>
      </div>
    </header>
  );
};

export default Header;

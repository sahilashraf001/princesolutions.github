import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section id="home" className="relative w-full h-screen flex justify-center items-center overflow-hidden text-center text-white">
      <div className="hero-background"></div>
      <div className="relative z-10 p-8 max-w-3xl bg-black bg-opacity-60 rounded-2xl shadow-2xl animate-fadeInUp">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase mb-5 tracking-wider animate-slideInFromTop">
          Empowering Businesses
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 leading-relaxed animate-fadeInSubtitle">
          Seamlessly integrate IT innovation with world-class security.
        </p>
        <Link href="/services" passHref>
          <Button
            variant="default"
            className="bg-accent text-white text-lg sm:text-xl md:text-2xl px-8 py-4 sm:px-10 sm:py-5 rounded-full cursor-pointer transition-all duration-300 ease-in-out shadow-lg hover:bg-orange-600 hover:scale-105 hover:shadow-xl animate-fadeInButton"
            aria-label="Explore Our Services"
          >
            Explore Our Services
          </Button>
        </Link>
      </div>
    </section>
  );
}

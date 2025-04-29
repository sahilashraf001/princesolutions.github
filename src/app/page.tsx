import { HeroSection } from '@/components/sections/hero-section';
import { AboutSection } from '@/components/sections/about-section';
import { ContactSection } from '@/components/sections/contact-section';
import { ContactForm } from '@/components/sections/contact-form';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <AboutSection />
      <ContactSection />
      <ContactForm />
    </main>
  );
}

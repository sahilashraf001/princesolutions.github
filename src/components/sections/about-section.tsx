import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

export function AboutSection() {
  return (
    <section id="about" className="bg-secondary py-20 px-5 text-center text-foreground">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex-1 max-w-lg group">
          <Card className="overflow-hidden shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-2xl">
            <CardContent className="p-0">
               <Image
                src="https://github.com/user-attachments/assets/d0be576f-5e5b-48df-8f3c-64813b4bd073"
                alt="About Prince Solutions"
                width={500}
                height={400}
                className="w-full h-auto object-cover rounded-lg"
              />
            </CardContent>
          </Card>
        </div>
        <div className="flex-1 max-w-xl group">
         <Card className="p-8 bg-card shadow-lg rounded-lg text-left transition-transform duration-300 ease-in-out group-hover:-translate-y-2 group-hover:shadow-2xl">
            <CardContent>
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-5">About Us</h2>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  At Prince Solutions, we are dedicated to providing cutting-edge CCTV camera solutions to ensure the safety and security of your home, business, and property. With years of expertise in the security industry, we specialize in offering high-quality surveillance systems tailored to meet the unique needs of our clients. Whether it&apos;s for residential, commercial, or industrial purposes, we provide reliable and easy-to-use camera systems designed to monitor, protect, and give you peace of mind. Our products include state-of-the-art cameras, real-time monitoring, and customized security solutions, all backed by exceptional customer service. At Prince Solutions, your safety is our priority, and we work tirelessly to deliver the best in security technology.
                </p>
            </CardContent>
           </Card>
        </div>
      </div>
    </section>
  );
}

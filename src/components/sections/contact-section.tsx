import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react'; // Using lucide-react for icons

const contactItems = [
  {
    icon: Mail,
    title: 'Email Us',
    content: <a href="mailto:msprincesolutions@gmail.com" className="hover:text-accent transition-colors">msprincesolutions@gmail.com</a>,
    alt: 'Email Icon'
  },
  {
    icon: Phone,
    title: 'Call Us',
    content: (
      <>
        <a href="tel:+919927122440" className="block hover:text-accent transition-colors">+91-9917122440</a>
        <a href="tel:+919917122440" className="block hover:text-accent transition-colors">+91-9917122440</a>
      </>
    ),
    alt: 'Phone Icon'
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    content: 'Opp. Govt Hospital, Moh Kavi Nagar, Gajraula(Amroha) 244235',
    alt: 'Location Icon'
  },
  {
    icon: Instagram,
    title: 'Follow Us on Instagram',
    content: <a href="https://www.instagram.com/prince.solutions" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">prince.solutions</a>,
    alt: 'Instagram Icon'
  },
  {
    icon: Facebook,
    title: 'Follow Us on Facebook',
    content: <a href="https://www.facebook.com/profile.php?id=61564082030508" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Prince solutions</a>,
    alt: 'Facebook Icon'
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="bg-card py-16 px-5 text-center text-card-foreground">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Get in Touch</h2>
          <p className="text-lg text-muted-foreground">
            We would love to hear from you! Reach out to us for inquiries, support, or project discussions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {contactItems.map((item, index) => (
            <Card key={index} className="bg-secondary/30 shadow-md rounded-lg overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
              <CardHeader className="flex flex-col items-center p-6">
                 <item.icon className="w-12 h-12 text-accent mb-4" aria-label={item.alt}/>
                <CardTitle className="text-xl font-semibold text-primary">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-base text-muted-foreground px-6 pb-6">
                {item.content}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="w-full flex justify-center">
            <div className="w-full md:w-2/3 lg:w-1/2 aspect-video">
                 <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d218.44205758793515!2d78.24258437198287!3d28.83668891247085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390b75712f1d15b5%3A0x61dbe2a8ac765515!2sM%2Fs%20Prince%20Solutions!5e0!3m2!1sen!2sin!4v1734622649253!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="border-0 rounded-lg shadow-lg"
                    title="Prince Solutions Location Map"
                 ></iframe>
             </div>
        </div>
      </div>
    </section>
  );
}


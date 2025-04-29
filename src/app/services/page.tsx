// src/app/services/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Our Services</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground">
            Detailed information about our services will be available here soon.
            We offer a wide range of IT and Security solutions including CCTV installation, network setup, cybersecurity, and more.
          </p>
          {/* Add more specific service details or sections later */}
           <img src="https://picsum.photos/800/400?random=1" alt="Services placeholder" className="mt-8 rounded-lg shadow-md mx-auto" />
        </CardContent>
      </Card>
    </div>
  );
}

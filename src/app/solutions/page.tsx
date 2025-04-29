// src/app/solutions/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SolutionsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
       <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Our Solutions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground">
            Explore the comprehensive solutions we provide, tailored to meet your specific security and IT needs.
            From residential security systems to large-scale enterprise solutions, we've got you covered.
          </p>
          {/* Add specific solution details or case studies later */}
          <img src="https://picsum.photos/800/400?random=2" alt="Solutions placeholder" className="mt-8 rounded-lg shadow-md mx-auto" />
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/cart-context'; // Import useCart
import type { Product } from '@/lib/types'; // Import Product type

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart(); // Get addToCart from context

  const formatAsINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full group">
      <CardHeader className="p-0">
        <div className="aspect-video relative w-full overflow-hidden">
           <Image
             src={product.imageUrl}
             alt={product.name}
             fill
             style={{ objectFit: 'cover' }}
             sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
             className="transition-transform duration-300 group-hover:scale-105"
           />
           <div className="absolute top-2 right-2 bg-secondary/80 text-secondary-foreground px-2 py-1 rounded-full text-xs font-medium">
               {product.category}
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-semibold mb-1 group-hover:text-accent transition-colors">{product.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</CardDescription>
        <p className="text-xl font-bold text-primary">{formatAsINR(product.price)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        <Button className="w-full bg-accent text-accent-foreground hover:bg-orange-600 transition-colors" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Trash2, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/cart-context";
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, itemCount } = useCart();

  const formatAsINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-16 min-h-[calc(100vh-200px)]">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-3xl font-bold text-center flex items-center justify-center">
            <ShoppingCart className="mr-3 h-8 w-8 text-primary" /> Your Shopping Cart
          </CardTitle>
           {itemCount > 0 && (
             <CardDescription className="text-center text-muted-foreground">
               You have {itemCount} item(s) in your cart.
             </CardDescription>
           )}
        </CardHeader>
        <CardContent className="p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-xl text-muted-foreground mb-6">Your cart is empty.</p>
              <Link href="/store" passHref>
                 <Button variant="outline" className="text-accent border-accent hover:bg-accent/10">
                  Continue Shopping
                 </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map(item => (
                <div key={item.id} className="flex flex-col md:flex-row justify-between items-center border-b pb-4 gap-4 md:gap-6">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                     <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                       <Image
                         src={item.imageUrl}
                         alt={item.name}
                         fill
                         style={{ objectFit: 'cover' }}
                         sizes="80px"
                       />
                     </div>
                    <div className="flex-grow">
                      <p className="font-semibold text-lg">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                       <p className="text-sm font-medium text-primary">{formatAsINR(item.price)} each</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                     {/* Quantity Controls */}
                     <div className="flex items-center border rounded-md">
                       <Button
                         variant="ghost"
                         size="icon"
                         className="h-8 w-8"
                         onClick={() => updateQuantity(item.id, item.quantity - 1)}
                         disabled={item.quantity <= 1}
                       >
                         <Minus className="h-4 w-4" />
                       </Button>
                       <Input
                         type="number"
                         value={item.quantity}
                         onChange={(e) => {
                            const newQuantity = parseInt(e.target.value);
                            if (!isNaN(newQuantity) && newQuantity >= 1) {
                                updateQuantity(item.id, newQuantity);
                            } else if (e.target.value === '') {
                                // Allow clearing the input, maybe handle minimum later
                            }
                         }}
                         onBlur={(e) => { // Handle case where user leaves input empty or invalid
                            if (isNaN(item.quantity) || item.quantity < 1) {
                                updateQuantity(item.id, 1); // Reset to 1 if invalid
                            }
                         }}
                         className="h-8 w-12 text-center border-l border-r rounded-none focus-visible:ring-0"
                         min="1"
                       />
                       <Button
                         variant="ghost"
                         size="icon"
                         className="h-8 w-8"
                         onClick={() => updateQuantity(item.id, item.quantity + 1)}
                       >
                         <Plus className="h-4 w-4" />
                       </Button>
                     </div>

                    {/* Item Total */}
                    <p className="font-semibold text-lg w-24 text-right">{formatAsINR(item.price * item.quantity)}</p>

                     {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 h-8 w-8"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                   </div>
                </div>
              ))}
              <div className="flex justify-end pt-4">
                 <Button variant="outline" size="sm" onClick={clearCart} className="text-destructive border-destructive hover:bg-destructive/10">
                  Clear Cart
                 </Button>
               </div>
            </div>
          )}
        </CardContent>
         {cartItems.length > 0 && (
           <CardFooter className="flex flex-col items-end pt-6 border-t bg-muted/30 p-6 rounded-b-lg">
             <div className="w-full max-w-xs space-y-2 mb-6">
                <div className="flex justify-between text-lg">
                    <span>Subtotal:</span>
                    <span>{formatAsINR(cartTotal)}</span>
                </div>
                 <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping:</span>
                    <span>Calculated at checkout</span>
                 </div>
                  <div className="flex justify-between text-xl font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span>{formatAsINR(cartTotal)}</span>
                </div>
             </div>
              <Link href="/checkout" passHref>
                <Button className="w-full md:w-auto bg-accent text-accent-foreground hover:bg-orange-600 text-lg py-3 px-8">
                  Proceed to Checkout
                </Button>
              </Link>
           </CardFooter>
         )}
      </Card>
    </div>
  );
}

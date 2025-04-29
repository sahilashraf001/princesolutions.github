// src/lib/types.ts

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string; // Added category
}

export interface CartItem extends Product {
  quantity: number;
}

// src/app/store/page.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { ProductCard } from '@/components/store/product-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Product } from '@/lib/types';
import { Input } from "@/components/ui/input"; // Import Input component

// Expanded placeholder product data with categories
const products: Product[] = [
  // CCTV Cameras
  { id: '1', name: 'HD Dome Camera', price: 89.99, description: 'Indoor HD dome camera with IR night vision.', imageUrl: 'https://picsum.photos/seed/dome1/400/300', category: 'CCTV Cameras' },
  { id: '2', name: 'Outdoor Bullet Camera', price: 129.50, description: 'Weatherproof bullet camera, 1080p resolution.', imageUrl: 'https://picsum.photos/seed/bullet1/400/300', category: 'CCTV Cameras' },
  { id: '5', name: 'Outdoor Floodlight Cam', price: 249.99, description: 'Motion-activated lights and camera.', imageUrl: 'https://picsum.photos/seed/flood1/400/300', category: 'CCTV Cameras' },
  { id: '9', name: 'PTZ Security Camera', price: 299.00, description: 'Pan-Tilt-Zoom camera with 360° coverage.', imageUrl: 'https://picsum.photos/seed/ptz1/400/300', category: 'CCTV Cameras' },
   { id: '11', name: 'Wireless Battery Camera', price: 159.99, description: 'Easy setup wire-free security camera.', imageUrl: 'https://picsum.photos/seed/batterycam/400/300', category: 'CCTV Cameras' },

  // Access Control
  { id: '20', name: 'Smart Door Lock', price: 149.50, description: 'Keyless entry with remote access via app.', imageUrl: 'https://picsum.photos/seed/lock1/400/300', category: 'Access Control' },
  { id: '6', name: 'Video Doorbell Pro', price: 179.00, description: 'See and speak to visitors from anywhere, HD video.', imageUrl: 'https://picsum.photos/seed/doorbell1/400/300', category: 'Access Control' },
   { id: '21', name: 'RFID Card Reader', price: 75.00, description: 'Secure access using RFID cards or fobs.', imageUrl: 'https://picsum.photos/seed/rfid/400/300', category: 'Access Control' },

  // Recorders & Storage
  { id: '3', name: '8-Channel NVR', price: 349.00, description: 'Network Video Recorder for up to 8 cameras.', imageUrl: 'https://picsum.photos/seed/nvr1/400/300', category: 'Recorders & Storage' },
  { id: '10', name: '4TB Surveillance HDD', price: 119.00, description: 'Hard drive optimized for 24/7 recording.', imageUrl: 'https://picsum.photos/seed/hdd1/400/300', category: 'Recorders & Storage' },
   { id: '12', name: '16-Channel DVR Kit', price: 499.00, description: 'Digital Video Recorder with 4 included cameras.', imageUrl: 'https://picsum.photos/seed/dvrkit/400/300', category: 'Recorders & Storage' },

  // Alarm Systems
  { id: '4', name: 'Wireless Alarm System Kit', price: 299.00, description: 'Complete home alarm kit with sensors.', imageUrl: 'https://picsum.photos/seed/alarm1/400/300', category: 'Alarm Systems' },
  { id: '15', name: 'Motion Sensor PIR', price: 35.00, description: 'Passive infrared motion detector.', imageUrl: 'https://picsum.photos/seed/pir1/400/300', category: 'Alarm Systems' },
   { id: '16', name: 'Door/Window Contact Sensor', price: 25.00, description: 'Magnetic sensor for doors and windows.', imageUrl: 'https://picsum.photos/seed/contactsensor/400/300', category: 'Alarm Systems' },

  // Accessories
  { id: '30', name: 'PoE Injector', price: 29.99, description: 'Power over Ethernet injector for IP cameras.', imageUrl: 'https://picsum.photos/seed/poe1/400/300', category: 'Accessories' },
  { id: '31', name: '100ft BNC Cable', price: 19.99, description: 'Siamese cable for power and video.', imageUrl: 'https://picsum.photos/seed/bnc1/400/300', category: 'Accessories' },
   { id: '32', name: 'Camera Mounting Bracket', price: 15.00, description: 'Universal mounting bracket for cameras.', imageUrl: 'https://picsum.photos/seed/bracket1/400/300', category: 'Accessories' },
];

// Get unique categories for filtering
const categories = ['All Categories', ...Array.from(new Set(products.map(p => p.category)))];

export default function StorePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [searchQuery, setSearchQuery] = useState<string>(''); // Add search query state

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

     if (searchQuery) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

    return filtered;
  }, [selectedCategory, searchQuery]);

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="mb-12 shadow-md">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Our Products</CardTitle>
             <CardDescription className="text-lg text-muted-foreground text-center pt-2">
                Browse our selection of high-quality security and IT products.
             </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 pb-6">
             <div className="flex flex-col sm:flex-row items-center gap-4">
                <p className="text-md font-medium text-foreground">Filter by Category:</p>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-[280px] bg-secondary/50">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>

             {/* Add Search Input */}
             <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-[280px] bg-secondary/50"
             />
          </CardContent>
       </Card>

       {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
           <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No products found in the "{selectedCategory}" category.</p>
            </div>
        )}
    </div>
  );
}

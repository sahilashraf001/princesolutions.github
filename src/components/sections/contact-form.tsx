'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

export function ContactForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

 async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch('https://formsubmit.co/ajax/msprincesolutions@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(values)
      });

      if (response.ok) {
         toast({
            title: "Message Sent!",
            description: "Thank you for contacting us. We'll get back to you soon.",
         });
         form.reset(); // Reset form fields
      } else {
          const data = await response.json();
          throw new Error(data.message || 'Failed to send message.');
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
       toast({
          title: "Submission Error",
          description: error.message || "There was a problem sending your message. Please try again later.",
          variant: "destructive",
        });
    }
  }

  return (
    <section className="flex justify-center items-center min-h-[80vh] bg-gradient-to-r from-blue-500 to-purple-600 p-8">
      <div className="bg-card p-8 md:p-12 rounded-lg shadow-xl w-full max-w-md text-center animate-fadeIn">
        <h3 className="text-2xl md:text-3xl font-bold text-primary mb-6 tracking-wide">Contact Us</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-left">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-muted-foreground">Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} className="bg-secondary/30 focus:border-accent focus:ring-accent" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-muted-foreground">Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email" {...field} className="bg-secondary/30 focus:border-accent focus:ring-accent" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-muted-foreground">Your Message</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us how we can help" {...field} className="min-h-[120px] bg-secondary/30 focus:border-accent focus:ring-accent resize-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             {/* Honeypot field */}
             <input type="text" name="_honey" style={{ display: 'none' }} />
             {/* Disable Captcha */}
             <input type="hidden" name="_captcha" value="false" />
             {/* Optional: Specify next page after submission */}
             {/* <input type="hidden" name="_next" value="https://yoursite.co/thanks" /> */}

            <Button type="submit" className="w-full bg-accent text-accent-foreground py-3 rounded-full text-base font-semibold hover:bg-orange-600 transition-colors duration-300" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
}

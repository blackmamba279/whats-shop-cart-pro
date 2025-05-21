
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

// Define form schema using Zod
const formSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .regex(/^\+?[0-9]+$/, { message: "Phone number must contain only digits, optionally starting with +" }),
  defaultMessage: z.string().min(10, { message: "Default message must be at least 10 characters" }),
  productMessageTemplate: z.string().min(10, { message: "Product message template must be at least 10 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

const AdminWhatsApp = () => {
  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: localStorage.getItem('waPhoneNumber') || '1234567890',
      defaultMessage: localStorage.getItem('waDefaultMessage') || 'Hello! I am interested in your products.',
      productMessageTemplate: localStorage.getItem('waProductMessageTemplate') || 'Hello! I am interested in {productName} priced at ${productPrice}.',
    },
  });

  const onSubmit = (data: FormValues) => {
    // Store in localStorage for persistence
    localStorage.setItem('waPhoneNumber', data.phoneNumber);
    localStorage.setItem('waDefaultMessage', data.defaultMessage);
    localStorage.setItem('waProductMessageTemplate', data.productMessageTemplate);
    
    toast.success("WhatsApp settings saved successfully");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">WhatsApp Settings</h1>
      
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Configure WhatsApp Integration</CardTitle>
          <CardDescription>
            Set your WhatsApp phone number and customize the messages sent to customers.
          </CardDescription>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="1234567890" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter your business WhatsApp number without spaces (e.g., 1234567890 or +1234567890)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="defaultMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Contact Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Hello! I am interested in your products." 
                        {...field} 
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      This message will be used when customers click the general WhatsApp contact button
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="productMessageTemplate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Message Template</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Hello! I am interested in {productName} priced at ${productPrice}." 
                        {...field} 
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      Use {'{productName}'} and {'{productPrice}'} as placeholders that will be replaced with the actual product details
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            
            <CardFooter>
              <Button type="submit" className="bg-whatsapp hover:bg-whatsapp/90">
                <Save className="mr-2 h-4 w-4" /> Save Settings
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AdminWhatsApp;

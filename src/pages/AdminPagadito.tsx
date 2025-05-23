
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const pagaditoFormSchema = z.object({
  uid: z.string().min(1, { message: 'UID is required' }),
  wsk: z.string().min(1, { message: 'WSK is required' }),
  sandbox: z.boolean().default(true),
  return_url: z.string().url({ message: 'Must be a valid URL' }).optional(),
  webhook_url: z.string().url({ message: 'Must be a valid URL' }).optional(),
});

type PagaditoFormValues = z.infer<typeof pagaditoFormSchema>;

interface PaymentSettingsType {
  id: string;
  provider: string;
  settings: string;
  webhook_key: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const AdminPagadito = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<PagaditoFormValues | null>(null);
  const [webhookKey, setWebhookKey] = useState<string>('');
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);

  const form = useForm<PagaditoFormValues>({
    resolver: zodResolver(pagaditoFormSchema),
    defaultValues: {
      uid: '',
      wsk: '',
      sandbox: true,
      return_url: `${window.location.origin}/order-success`,
      webhook_url: `${window.location.origin}/api/webhooks/pagadito`,
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        // Use any() to bypass the type checking until the database schema is updated in types.ts
        const { data, error } = await supabase
          .from('payment_settings')
          .select('*')
          .eq('provider', 'pagadito')
          .maybeSingle() as { data: PaymentSettingsType | null, error: any };

        if (error) {
          console.error('Error fetching Pagadito settings:', error);
        } else if (data) {
          const parsedSettings = JSON.parse(data.settings as string);
          setSettings(parsedSettings);
          form.reset({
            uid: parsedSettings.uid || '',
            wsk: parsedSettings.wsk || '',
            sandbox: parsedSettings.sandbox !== undefined ? parsedSettings.sandbox : true,
            return_url: parsedSettings.return_url || `${window.location.origin}/order-success`,
            webhook_url: parsedSettings.webhook_url || `${window.location.origin}/api/webhooks/pagadito`,
          });
          
          if (data.webhook_key) {
            setWebhookKey(data.webhook_key);
          }
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [form]);

  const onSubmit = async (values: PagaditoFormValues) => {
    setIsLoading(true);
    try {
      // Use any() to bypass type checking
      const { error } = await supabase
        .from('payment_settings')
        .upsert({
          provider: 'pagadito',
          settings: JSON.stringify(values),
          webhook_key: webhookKey,
          updated_at: new Date().toISOString(),
        } as any, {
          onConflict: 'provider'
        });

      if (error) {
        throw error;
      }

      toast.success('Pagadito settings saved successfully');
      setSettings(values);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const generateWebhookKey = async () => {
    setIsGeneratingKey(true);
    try {
      // Generate a random webhook key
      const array = new Uint8Array(32);
      window.crypto.getRandomValues(array);
      const newKey = Array.from(array)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
        
      setWebhookKey(newKey);
      
      // Save the new webhook key
      const { error } = await supabase
        .from('payment_settings')
        .upsert({
          provider: 'pagadito',
          webhook_key: newKey,
          settings: JSON.stringify(form.getValues()),
          updated_at: new Date().toISOString(),
        } as any, {
          onConflict: 'provider'
        });

      if (error) {
        throw error;
      }
      
      toast.success('Webhook key generated successfully');
    } catch (error) {
      console.error('Error generating webhook key:', error);
      toast.error('Failed to generate webhook key');
    } finally {
      setIsGeneratingKey(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Pagadito Settings</h2>
      
      <Tabs defaultValue="settings">
        <TabsList>
          <TabsTrigger value="settings">API Credentials</TabsTrigger>
          <TabsTrigger value="webhook">Webhook</TabsTrigger>
          <TabsTrigger value="test">Test Connection</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pagadito API Credentials</CardTitle>
              <CardDescription>
                Configure your Pagadito API credentials to enable payment processing. 
                Get your credentials from your Pagadito merchant account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="uid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>UID</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Pagadito UID" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter your Pagadito merchant UID
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="wsk"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WSK</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Your Pagadito WSK" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter your Pagadito merchant WSK (Web Service Key)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="sandbox"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-2 rounded-lg border p-3">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-5 w-5"
                          />
                        </FormControl>
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Use Sandbox Environment
                          </FormLabel>
                          <FormDescription>
                            Enable this for testing payments in the Pagadito sandbox environment
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="return_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Return URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://yourdomain.com/order-success" {...field} />
                        </FormControl>
                        <FormDescription>
                          URL where customers will be redirected after payment
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                      Save Settings
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="webhook" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <CardDescription>
                Configure webhook endpoints to receive payment notifications from Pagadito
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <FormLabel>Webhook URL</FormLabel>
                <div className="flex gap-2 mt-1">
                  <Input 
                    value={form.getValues().webhook_url || `${window.location.origin}/api/webhooks/pagadito`} 
                    readOnly
                  />
                  <Button variant="outline" onClick={() => {
                    navigator.clipboard.writeText(form.getValues().webhook_url || `${window.location.origin}/api/webhooks/pagadito`);
                    toast.success('URL copied to clipboard');
                  }}>
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Add this URL to your Pagadito merchant account webhook settings
                </p>
              </div>
              
              <div className="pt-4">
                <FormLabel>Webhook Security Key</FormLabel>
                <div className="flex gap-2 mt-1">
                  <Input 
                    value={webhookKey} 
                    type="password"
                    readOnly
                  />
                  <Button
                    variant="outline"
                    onClick={generateWebhookKey}
                    disabled={isGeneratingKey}
                  >
                    {isGeneratingKey ? (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      'Generate New Key'
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  This key is used to verify webhook requests from Pagadito
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Form {...form}>
                <Button 
                  onClick={form.handleSubmit(onSubmit)} 
                  disabled={isLoading}
                >
                  {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  Save Settings
                </Button>
              </Form>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="test" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Pagadito Connection</CardTitle>
              <CardDescription>
                Test your connection to the Pagadito payment gateway
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                You can test your Pagadito connection by creating a test payment:
              </p>
              <div className="flex justify-end">
                <Form {...form}>
                  <Button 
                    onClick={async () => {
                      try {
                        const testSettings = form.getValues();
                        if (!testSettings.uid || !testSettings.wsk) {
                          toast.error('Please enter your Pagadito credentials first');
                          return;
                        }

                        const result = await fetch('/api/pagadito-test', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(testSettings),
                        });
                        
                        if (result.ok) {
                          toast.success('Connection to Pagadito successful');
                        } else {
                          const errorData = await result.json();
                          toast.error(`Connection failed: ${errorData.message}`);
                        }
                      } catch (error) {
                        console.error('Test connection error:', error);
                        toast.error('Failed to test connection');
                      }
                    }}
                  >
                    Test Connection
                  </Button>
                </Form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPagadito;

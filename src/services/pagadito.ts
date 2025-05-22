
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Types for Pagadito payment
export interface PagaditoPaymentOptions {
  uid?: string;
  wsk?: string;
  amount: number;
  description: string;
  currency?: string;
  orderId: string;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  returnUrl?: string;
  cancelUrl?: string;
}

export interface PagaditoSettings {
  uid: string;
  wsk: string;
  sandbox: boolean;
  return_url?: string;
  webhook_url?: string;
}

class PagaditoService {
  private UID: string = '';
  private WSK: string = '';
  private SANDBOX_URL: string = 'https://sandbox.pagadito.com/comercios/';
  private PRODUCTION_URL: string = 'https://comercios.pagadito.com/';
  private isSandbox: boolean = true;
  private returnUrl: string = '';
  private cancelUrl: string = '';
  private webhook_key: string = '';
  private isInitialized: boolean = false;

  constructor() {
    this.initializeSettings();
  }

  /**
   * Initialize settings from the database
   */
  private async initializeSettings() {
    try {
      const { data, error } = await supabase
        .from('payment_settings')
        .select('*')
        .eq('provider', 'pagadito')
        .single();

      if (error) {
        console.error('Error loading Pagadito settings:', error);
        return;
      }

      if (data) {
        const settings = JSON.parse(data.settings) as PagaditoSettings;
        this.UID = settings.uid;
        this.WSK = settings.wsk;
        this.isSandbox = settings.sandbox !== undefined ? settings.sandbox : true;
        this.returnUrl = settings.return_url || window.location.origin + '/order-success';
        this.cancelUrl = settings.return_url || window.location.origin + '/checkout';
        this.webhook_key = data.webhook_key || '';
        this.isInitialized = true;
        console.log('Pagadito settings loaded successfully');
      }
    } catch (error) {
      console.error('Failed to initialize Pagadito settings:', error);
    }
  }

  /**
   * Create a payment session with Pagadito
   */
  async createPayment(options: PagaditoPaymentOptions) {
    try {
      // Make sure settings are loaded
      if (!this.isInitialized) {
        await this.initializeSettings();
      }

      if (!this.UID || !this.WSK) {
        console.error('Pagadito credentials not configured');
        return {
          success: false,
          error: 'Payment gateway not configured. Please contact the administrator.',
          data: null
        };
      }

      // In a real implementation, this would make an API call to Pagadito
      console.log('Creating payment with Pagadito:', options);
      
      // Create a specific transaction ID format
      const simulatedPaymentId = `pgto-${Math.random().toString(36).substring(2, 10)}`;
      
      // Create the order in our database
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          id: options.orderId,
          total_amount: options.amount,
          customer_name: options.customerInfo.name,
          customer_email: options.customerInfo.email,
          customer_phone: options.customerInfo.phone || null,
          payment_method: 'pagadito',
          transaction_id: simulatedPaymentId
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating order:', error);
        toast.error('Error creating order');
        return {
          success: false,
          error: error.message,
          data: null
        };
      }
      
      // Generate the payment URL for redirection
      const paymentUrl = `${this.isSandbox ? this.SANDBOX_URL : this.PRODUCTION_URL}?token=${simulatedPaymentId}`;
      
      return {
        success: true,
        data: {
          paymentId: simulatedPaymentId,
          paymentUrl,
          order
        },
        error: null
      };
    } catch (error: any) {
      console.error('Error in Pagadito payment:', error);
      toast.error('Payment processing failed');
      return {
        success: false,
        error: error.message || 'Payment processing failed',
        data: null
      };
    }
  }

  /**
   * Verify a payment status with Pagadito
   */
  async verifyPayment(paymentId: string) {
    try {
      // Make sure settings are loaded
      if (!this.isInitialized) {
        await this.initializeSettings();
      }

      // In a real implementation, this would make an API call to Pagadito
      console.log('Verifying payment with Pagadito:', paymentId);

      // For demonstration, we're simulating a successful payment
      const simulatedStatus = Math.random() > 0.2 ? 'completed' : 'failed';
      
      if (simulatedStatus === 'completed') {
        // Update the order status in our database
        const { data, error } = await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            status: 'processing'
          })
          .eq('transaction_id', paymentId)
          .select()
          .single();
        
        if (error) {
          console.error('Error updating order status:', error);
          return {
            success: false,
            error: error.message,
            data: null
          };
        }
        
        return {
          success: true,
          data: {
            status: simulatedStatus,
            paymentId,
            order: data
          },
          error: null
        };
      } else {
        // Update the order status in our database
        await supabase
          .from('orders')
          .update({
            payment_status: 'failed'
          })
          .eq('transaction_id', paymentId);
          
        return {
          success: false,
          error: 'Payment failed or was cancelled',
          data: null
        };
      }
    } catch (error: any) {
      console.error('Error verifying Pagadito payment:', error);
      return {
        success: false,
        error: error.message || 'Payment verification failed',
        data: null
      };
    }
  }

  /**
   * Validate a webhook request from Pagadito
   */
  validateWebhook(signature: string, payload: any): boolean {
    // In a real implementation, this would validate the webhook signature
    // using the webhook_key
    console.log('Validating webhook with signature:', signature);
    return this.webhook_key === signature;
  }
}

export const pagaditoService = new PagaditoService();

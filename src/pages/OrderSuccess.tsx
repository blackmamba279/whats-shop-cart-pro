
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ShoppingBag, Loader } from 'lucide-react';
import WhatsAppContact from '@/components/WhatsAppContact';
import { supabase } from '@/integrations/supabase/client';
import { pagaditoService } from '@/services/pagadito';

interface Order {
  id: string;
  status: string;
  payment_status: string;
  customer_name: string;
  total_amount: number;
  created_at: string;
}

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  
  // Get transaction reference from URL query parameters
  const token = searchParams.get('token');
  const transactionId = token || localStorage.getItem('pendingOrderId') || '';
  
  useEffect(() => {
    const verifyPayment = async () => {
      if (!transactionId) return;
      
      setIsVerifying(true);
      try {
        // Verify the payment status with Pagadito
        const result = await pagaditoService.verifyPayment(transactionId);
        
        // If verification was successful, get the order details
        if (result.success) {
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('transaction_id', transactionId)
            .single();
            
          if (!error && data) {
            setOrder(data);
          }
        } else {
          console.error('Payment verification failed:', result.error);
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
      } finally {
        setIsVerifying(false);
        localStorage.removeItem('pendingOrderId');
      }
    };
    
    verifyPayment();
  }, [transactionId]);

  return (
    <div className="container max-w-2xl py-16 flex flex-col items-center">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            {isVerifying ? (
              <Loader className="h-10 w-10 text-green-600 animate-spin" />
            ) : (
              <CheckCircle className="h-10 w-10 text-green-600" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isVerifying 
              ? "Verifying Payment..." 
              : "Order Placed Successfully!"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {isVerifying ? (
            <p>Please wait while we verify your payment with Pagadito...</p>
          ) : (
            <>
              <p>Thank you for your purchase. We've received your order and it's being processed.</p>
              <p>You'll receive an email confirmation shortly with your order details.</p>
              <div className="py-4">
                <p className="text-sm text-gray-500">Order Number:</p>
                <p className="font-medium">
                  {order?.id 
                    ? `#${order.id.substring(0, 8)}`
                    : `#ORD-${Math.floor(100000 + Math.random() * 900000)}`}
                </p>
                {order && (
                  <>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Date:</p>
                      <p className="font-medium">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Total Amount:</p>
                      <p className="font-medium">
                        ${Number(order.total_amount).toFixed(2)}
                      </p>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Status:</p>
                      <p className="font-medium">
                        {order.payment_status === 'paid' ? (
                          <span className="text-green-600">Payment Completed</span>
                        ) : (
                          <span className="text-yellow-600">Pending Payment</span>
                        )}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Link to="/products" className="w-full">
            <Button variant="outline" className="w-full">
              <ShoppingBag className="mr-2 h-4 w-4" /> Continue Shopping
            </Button>
          </Link>
          <WhatsAppContact className="w-full">
            Ask about your order via WhatsApp
          </WhatsAppContact>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OrderSuccess;

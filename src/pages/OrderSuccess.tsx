
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import WhatsAppContact from '@/components/WhatsAppContact';

const OrderSuccess = () => {
  return (
    <div className="container max-w-2xl py-16 flex flex-col items-center">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Order Placed Successfully!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>Thank you for your purchase. We've received your order and it's being processed.</p>
          <p>You'll receive an email confirmation shortly with your order details.</p>
          <div className="py-4">
            <p className="text-sm text-gray-500">Order Number:</p>
            <p className="font-medium">#ORD-{Math.floor(100000 + Math.random() * 900000)}</p>
          </div>
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

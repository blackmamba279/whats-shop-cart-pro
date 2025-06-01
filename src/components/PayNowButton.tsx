
import React from 'react';
import { Button } from './ui/button';
import { CreditCard } from 'lucide-react';

interface PayNowButtonProps {
  paymentLink: string;
  productName: string;
  className?: string;
}

const PayNowButton: React.FC<PayNowButtonProps> = ({ 
  paymentLink, 
  productName, 
  className = "" 
}) => {
  const handlePayNow = () => {
    window.open(paymentLink, '_blank');
  };

  return (
    <Button 
      onClick={handlePayNow}
      className={`bg-blue-600 hover:bg-blue-700 text-white ${className}`}
    >
      <CreditCard className="mr-2 h-4 w-4" />
      Pay Now
    </Button>
  );
};

export default PayNowButton;

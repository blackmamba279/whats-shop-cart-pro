
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/cart-context';
import { Button } from '../components/ui/button';
import WhatsAppContact from '../components/WhatsAppContact';
import { Minus, Plus, ShoppingCart, Trash2, CreditCard } from 'lucide-react';
import { pagaditoService } from '../services/pagadito';
import { toast } from 'sonner';

const Cart = () => {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      // Remove any existing script first
      const existingScript = document.querySelector('script[src*="comercios.pagadito.com"]');
      if (existingScript) {
        existingScript.remove();
      }
      
      // Load Pagadito merchant validation script
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://comercios.pagadito.com/validate/index.php?merchant=6034e62d2d08eff1a3e05dd0491fbaec&size=m&_idioma=en';
      script.async = true;
      
      // Find the pagadito container and append the script
      const pagaditoContainer = document.getElementById('pagadito-certification');
      if (pagaditoContainer) {
        pagaditoContainer.appendChild(script);
      }
    }, 100);
    
    return () => {
      clearTimeout(timer);
      // Cleanup script when component unmounts
      const script = document.querySelector('script[src*="comercios.pagadito.com"]');
      if (script) {
        script.remove();
      }
    };
  }, []);
  
  const handlePagaditoPayment = async () => {
    try {
      // Generate a proper UUID for the order
      const orderId = crypto.randomUUID();
      
      const result = await pagaditoService.createPayment({
        amount: total,
        description: `Order with ${items.length} items`,
        orderId: orderId,
        customerInfo: {
          name: 'Customer',
          email: 'customer@example.com'
        }
      });
      
      if (result.success && result.data) {
        // Redirect to Pagadito payment page
        window.open(result.data.paymentUrl, '_blank');
      } else {
        toast.error(result.error || 'Payment processing failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment processing failed');
    }
  };
  
  if (items.length === 0) {
    return (
      <div className="container py-16 px-4 md:px-6 text-center max-w-4xl mx-auto">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-6 rounded-full bg-gray-100">
            <ShoppingCart className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
          <p className="text-gray-500">Add items to your cart to get started with shopping.</p>
          <Link to="/products">
            <Button className="bg-whatsapp hover:bg-whatsapp-dark text-white">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 md:px-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="divide-y border rounded-lg">
            {items.map(item => (
              <div key={item.id} className="p-4 flex flex-col sm:flex-row gap-4">
                <Link to={`/product/${item.id}`} className="shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                </Link>
                
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.id}`} className="hover:text-whatsapp">
                    <h3 className="font-medium text-lg line-clamp-1">{item.name}</h3>
                  </Link>
                  <div className="text-gray-500 text-sm mt-1">
                    ${item.price.toFixed(2)} per item
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border rounded-md">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-right font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-500 border-red-200"
              onClick={clearCart}
            >
              Clear Cart
            </Button>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 space-y-4 sticky top-20">
            <h2 className="font-bold text-xl">Order Summary</h2>
            
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="line-clamp-1">{item.name} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="pt-4 space-y-2">
              <WhatsAppContact size="lg" className="w-full">
                Checkout via WhatsApp
              </WhatsAppContact>
              
              <Button 
                onClick={handlePagaditoPayment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Pay with Pagadito
              </Button>
              
              <p className="text-xs text-gray-500 text-center">
                By proceeding, you'll be connected with our team on WhatsApp to complete your order or redirected to secure payment
              </p>
              
              {/* Pagadito Merchant Certification */}
              <div className="pt-4 text-center">
                <div className="text-xs text-gray-500 mb-2">Secure Payment Partner</div>
                <div id="pagadito-certification" className="min-h-[60px] flex items-center justify-center">
                  <div className="text-xs text-gray-400">Loading certification...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

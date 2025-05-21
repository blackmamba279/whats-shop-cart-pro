
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/cart-context';
import { Button } from '../components/ui/button';
import WhatsAppContact from '../components/WhatsAppContact';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';

const Cart = () => {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  
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
              
              <p className="text-xs text-gray-500 text-center">
                By proceeding, you'll be connected with our team on WhatsApp to complete your order
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

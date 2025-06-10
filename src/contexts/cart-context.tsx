
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../data/products';
import { toast } from 'sonner';
import { supabase } from '../integrations/supabase/client';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  total: number;
  getProductQuantityInCart: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  
  // Generate or retrieve session ID for anonymous users
  useEffect(() => {
    const storedSessionId = localStorage.getItem('cart_session_id');
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = crypto.randomUUID();
      localStorage.setItem('cart_session_id', newSessionId);
      setSessionId(newSessionId);
    }
  }, []);
  
  // Load cart from database or localStorage on component mount
  useEffect(() => {
    if (!sessionId) return;
    
    const loadCart = async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        
        if (user.user) {
          // Load from database for authenticated users
          await loadCartFromDatabase(user.user.id);
        } else {
          // Load from localStorage for anonymous users
          loadCartFromLocalStorage();
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        loadCartFromLocalStorage();
      }
    };
    
    loadCart();
  }, [sessionId]);
  
  // Save cart to database whenever it changes (for authenticated users)
  useEffect(() => {
    if (items.length > 0) {
      saveCartToDatabase();
    }
  }, [items]);

  const loadCartFromDatabase = async (userId: string) => {
    try {
      // First, get or create the user's cart
      let { data: cart } = await supabase
        .from('user_carts')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (!cart) {
        // Create a new cart if none exists
        const { data: newCart } = await supabase
          .from('user_carts')
          .insert({
            user_id: userId,
            status: 'active'
          })
          .select()
          .single();
        cart = newCart;
      }

      if (cart) {
        // Load cart items with product details
        const { data: cartItems } = await supabase
          .from('cart_items')
          .select(`
            *,
            products (*)
          `)
          .eq('cart_id', cart.id);

        if (cartItems) {
          const items = cartItems.map(item => {
            const product = item.products;
            return {
              id: product.id,
              name: product.name,
              price: product.price,
              originalPrice: product.original_price,
              description: product.description,
              image: product.image_url,
              category: product.category_id || 'general',
              inStock: product.in_stock,
              featured: product.featured,
              rating: product.rating,
              stock_quantity: product.stock_quantity,
              payment_link: product.payment_link,
              size: product.size,
              quantity: item.quantity
            };
          });
          setItems(items);
        }
      }
    } catch (error) {
      console.error('Error loading cart from database:', error);
      loadCartFromLocalStorage();
    }
  };

  const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse saved cart:', e);
      }
    }
  };

  const saveCartToDatabase = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (user.user) {
        // Get or create user cart
        let { data: cart } = await supabase
          .from('user_carts')
          .select('*')
          .eq('user_id', user.user.id)
          .eq('status', 'active')
          .single();

        if (!cart) {
          const { data: newCart } = await supabase
            .from('user_carts')
            .insert({
              user_id: user.user.id,
              status: 'active'
            })
            .select()
            .single();
          cart = newCart;
        }

        if (cart) {
          // Clear existing cart items
          await supabase
            .from('cart_items')
            .delete()
            .eq('cart_id', cart.id);

          // Insert current cart items
          if (items.length > 0) {
            const cartItems = items.map(item => ({
              cart_id: cart.id,
              product_id: item.id,
              quantity: item.quantity,
              price: item.price
            }));

            await supabase
              .from('cart_items')
              .insert(cartItems);
          }
        }
      }
    } catch (error) {
      console.error('Error saving cart to database:', error);
    }
    
    // Always save to localStorage as backup
    localStorage.setItem('cart', JSON.stringify(items));
  };

  const getProductQuantityInCart = (productId: string): number => {
    const item = items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const addItem = (product: Product) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
      const availableStock = (product.stock_quantity || 0) - currentQuantityInCart;
      
      if (availableStock <= 0) {
        toast.error('No more stock available for this product');
        return prevItems;
      }
      
      if (existingItem) {
        toast.success('Item quantity increased');
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        toast.success('Item added to cart');
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeItem = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
    toast.info('Item removed from cart');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.info('Cart cleared');
  };

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider 
      value={{ 
        items, 
        addItem, 
        removeItem, 
        updateQuantity, 
        clearCart, 
        itemCount, 
        total,
        getProductQuantityInCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

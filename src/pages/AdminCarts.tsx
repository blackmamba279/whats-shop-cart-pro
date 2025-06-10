
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, Eye, Search, ShoppingCart, Users } from 'lucide-react';

interface CartData {
  id: string;
  user_id: string | null;
  session_id: string | null;
  created_at: string;
  updated_at: string;
  status: string;
  items: Array<{
    id: string;
    product_id: string;
    quantity: number;
    price: number;
    product_name: string;
    product_image: string;
  }>;
  total: number;
  item_count: number;
  user_name?: string;
}

const AdminCarts = () => {
  const [carts, setCarts] = useState<CartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCart, setSelectedCart] = useState<CartData | null>(null);

  useEffect(() => {
    loadCarts();
    
    // Set up real-time subscription for cart updates
    const cartSubscription = supabase
      .channel('cart-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_carts'
        },
        () => {
          console.log('Cart updated, reloading...');
          loadCarts();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cart_items'
        },
        () => {
          console.log('Cart items updated, reloading...');
          loadCarts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(cartSubscription);
    };
  }, []);

  const loadCarts = async () => {
    try {
      setLoading(true);
      console.log('Loading carts...');
      
      // Load carts with their items and product details
      const { data: cartsData, error } = await supabase
        .from('user_carts')
        .select(`
          *,
          cart_items (
            id,
            product_id,
            quantity,
            price,
            products (
              name,
              image_url
            )
          )
        `)
        .eq('status', 'active')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error loading carts:', error);
        throw error;
      }

      console.log('Loaded carts data:', cartsData);

      // Process the data to include totals and user names
      const processedCarts = await Promise.all(
        cartsData?.map(async (cart) => {
          let userName = 'Anonymous';
          
          if (cart.user_id) {
            // Try to get user name from profiles table
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name, username')
              .eq('id', cart.user_id)
              .single();
              
            if (profile) {
              userName = profile.full_name || profile.username || 'Authenticated User';
            } else {
              userName = 'Authenticated User';
            }
          }

          const items = cart.cart_items?.map(item => ({
            id: item.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: Number(item.price),
            product_name: item.products?.name || 'Unknown Product',
            product_image: item.products?.image_url || '/placeholder.svg'
          })) || [];

          const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          const item_count = items.reduce((sum, item) => sum + item.quantity, 0);

          return {
            ...cart,
            items,
            total,
            item_count,
            user_name: userName
          };
        }) || []
      );

      console.log('Processed carts:', processedCarts);
      setCarts(processedCarts);
    } catch (error) {
      console.error('Error loading carts:', error);
      toast.error('Failed to load carts');
    } finally {
      setLoading(false);
    }
  };

  const removeItemFromCart = async (cartId: string, itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      toast.success('Item removed from cart');
      // Real-time subscription will handle the reload
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async (cartId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cartId);

      if (error) throw error;

      toast.success('Cart cleared successfully');
      // Real-time subscription will handle the reload
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const filteredCarts = carts.filter(cart =>
    cart.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cart.session_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cart.items.some(item => item.product_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalCarts = carts.length;
  const totalItems = carts.reduce((sum, cart) => sum + cart.item_count, 0);
  const totalValue = carts.reduce((sum, cart) => sum + cart.total, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading carts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cart Management</h1>
        <Button onClick={loadCarts} variant="outline">
          Refresh Data
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Carts</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCarts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by user, session ID, or product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Carts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Shopping Carts</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCarts.length === 0 ? (
            <Alert>
              <AlertDescription>
                No active carts found. Carts will appear here when users add items to their shopping cart.
              </AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCarts.map((cart) => (
                  <TableRow key={cart.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{cart.user_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {cart.user_id ? `ID: ${cart.user_id.slice(0, 8)}...` : `Session: ${cart.session_id?.slice(0, 8)}...`}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{cart.item_count} items</TableCell>
                    <TableCell>${cart.total.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(cart.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={cart.status === 'active' ? 'default' : 'secondary'}>
                        {cart.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCart(cart)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => clearCart(cart.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Cart Details Modal */}
      {selectedCart && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Cart Details - {selectedCart.user_name}</CardTitle>
              <Button
                variant="outline"
                onClick={() => setSelectedCart(null)}
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>User Type</Label>
                  <p className="text-sm">{selectedCart.user_id ? 'Authenticated' : 'Anonymous'}</p>
                </div>
                <div>
                  <Label>Total Value</Label>
                  <p className="text-sm font-semibold">${selectedCart.total.toFixed(2)}</p>
                </div>
              </div>
              
              <div>
                <Label>Cart Items</Label>
                <div className="mt-2 space-y-2">
                  {selectedCart.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={item.product_image} 
                          alt={item.product_name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">
                          ${(item.quantity * item.price).toFixed(2)}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItemFromCart(selectedCart.id, item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminCarts;

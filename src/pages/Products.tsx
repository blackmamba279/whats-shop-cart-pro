
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '../contexts/language-context';

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  description: string;
  image_url: string;
  category_id: string;
  in_stock: boolean;
  featured: boolean;
  rating: number;
  stock_quantity: number;
  payment_link?: string;
  size?: string;
}

interface Category {
  id: string;
  name: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

  // Load products from Supabase
  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('Products loaded:', data);
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    }
  };

  // Load categories from Supabase
  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Failed to load categories');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([loadProducts(), loadCategories()]);
      setIsLoading(false);
    };

    loadData();

    // Set up real-time subscription for products
    const productsSubscription = supabase
      .channel('products-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' },
        () => {
          console.log('Products changed, reloading...');
          loadProducts();
        }
      )
      .subscribe();

    // Set up real-time subscription for categories
    const categoriesSubscription = supabase
      .channel('categories-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'categories' },
        () => {
          console.log('Categories changed, reloading...');
          loadCategories();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productsSubscription);
      supabase.removeChannel(categoriesSubscription);
    };
  }, []);

  // Convert Supabase product format to match the existing ProductCard component
  const convertedProducts = products.map(product => {
    const category = categories.find(cat => cat.id === product.category_id);
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.original_price,
      description: product.description,
      image: product.image_url || '/placeholder.svg',
      category: category?.name || 'Unknown',
      inStock: product.in_stock,
      featured: product.featured,
      rating: product.rating,
      stock_quantity: product.stock_quantity,
      payment_link: product.payment_link,
      size: product.size
    };
  });

  if (isLoading) {
    return (
      <div className="container py-4 sm:py-8 px-4 md:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">{t('allProducts')}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 sm:py-8 px-4 md:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">{t('allProducts')}</h1>
      
      {convertedProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t('noProductsAvailable')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {convertedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;

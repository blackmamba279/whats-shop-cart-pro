
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { ChevronLeft } from 'lucide-react';
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
}

interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

const CategoryProducts = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load category and its products from Supabase
  useEffect(() => {
    const loadCategoryData = async () => {
      if (!categoryId) return;
      
      setIsLoading(true);
      try {
        // Load category details
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('*')
          .eq('id', categoryId)
          .single();

        if (categoryError) throw categoryError;
        setCategory(categoryData);

        // Load products in this category
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', categoryId)
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;
        setProducts(productsData || []);
      } catch (error) {
        console.error('Error loading category data:', error);
        toast.error('Failed to load category data');
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoryData();
  }, [categoryId]);

  // Convert Supabase product format to match ProductCard component
  const convertedProducts = products.map(product => ({
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.original_price,
    description: product.description,
    image: product.image_url || '/placeholder.svg',
    category: category?.name || 'Unknown',
    inStock: product.in_stock,
    featured: product.featured,
    rating: product.rating
  }));

  if (isLoading) {
    return (
      <div className="container py-8 px-4 md:px-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (!category) {
    return (
      <div className="container py-8 px-4 md:px-6 text-center">
        <h1 className="text-3xl font-bold mb-4">{t('categoryNotFound')}</h1>
        <p className="mb-4">{t('categoryNotFoundDescription')}</p>
        <Link to="/categories">
          <Button>{t('goToCategories')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      <Link to="/categories" className="inline-flex items-center text-sm mb-6 hover:text-whatsapp">
        <ChevronLeft className="h-4 w-4 mr-1" /> {t('backToCategories')}
      </Link>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{category.name}</h1>
        <p className="text-gray-500 mt-2">{category.description}</p>
      </div>
      
      {convertedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {convertedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium">{t('noProductsInCategory')}</h2>
          <p className="text-gray-500 mt-2">{t('checkBackSoon')}</p>
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;

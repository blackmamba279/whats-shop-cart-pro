
import React, { useState, useEffect } from 'react';
import CategoryCard from './CategoryCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load categories from Supabase
  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Convert Supabase category format to match the existing CategoryCard component
  const convertedCategories = categories.map(category => ({
    id: category.id,
    name: category.name,
    description: category.description,
    image: category.image_url || '/placeholder.svg'
  }));

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Shop by Category</h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Find exactly what you're looking for by browsing our product categories
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Shop by Category</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Find exactly what you're looking for by browsing our product categories
            </p>
          </div>
        </div>
        {convertedCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No categories available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {convertedCategories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryList;

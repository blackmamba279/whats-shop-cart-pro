import React, { useState, useEffect } from 'react';
import CategoryCard from '../components/CategoryCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '../contexts/language-context';

interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();

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
      <div className="container py-8 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-8">{t('allCategories')}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8">{t('allCategories')}</h1>
      
      {convertedCategories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t('noCategoriesAvailable')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {convertedCategories.map(category => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;

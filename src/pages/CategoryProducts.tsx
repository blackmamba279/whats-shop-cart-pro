
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductsByCategory, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { ChevronLeft } from 'lucide-react';

const CategoryProducts = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const products = getProductsByCategory(categoryId || '');
  const category = categories.find(cat => cat.id === categoryId);
  
  if (!category) {
    return (
      <div className="container py-8 px-4 md:px-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
        <p className="mb-4">Sorry, the category you are looking for does not exist.</p>
        <Link to="/categories">
          <Button>Go to Categories</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      <Link to="/categories" className="inline-flex items-center text-sm mb-6 hover:text-whatsapp">
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Categories
      </Link>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{category.name}</h1>
        <p className="text-gray-500 mt-2">{category.description}</p>
      </div>
      
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium">No products in this category yet</h2>
          <p className="text-gray-500 mt-2">Check back soon for new additions!</p>
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;

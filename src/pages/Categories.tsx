
import React from 'react';
import { categories } from '../data/products';
import CategoryCard from '../components/CategoryCard';

const Categories = () => {
  return (
    <div className="container py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8">All Categories</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map(category => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default Categories;

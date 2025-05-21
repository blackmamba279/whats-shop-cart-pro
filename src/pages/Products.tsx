
import React from 'react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

const Products = () => {
  return (
    <div className="container py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;


import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../data/products';
import { Card, CardContent } from './ui/card';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link to={`/category/${category.id}`}>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 animate-fade-in h-full">
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={category.image} 
            alt={category.name}
            className="object-cover w-full h-full transition-transform hover:scale-105 duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 p-4 text-white">
            <h3 className="font-bold text-xl">{category.name}</h3>
          </div>
        </div>
        <CardContent className="p-4">
          <p className="text-sm text-gray-500 line-clamp-2">{category.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CategoryCard;

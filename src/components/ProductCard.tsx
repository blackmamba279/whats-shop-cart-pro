
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../data/products';
import { useLanguage } from '../contexts/language-context';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { useCart } from '../contexts/cart-context';
import { ShoppingCart, Star } from 'lucide-react';
import { Badge } from './ui/badge';
import ImageModal from './ImageModal';
import PayNowButton from './PayNowButton';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const { t } = useLanguage();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsImageModalOpen(true);
  };

  return (
    <>
      <Link to={`/product/${product.id}`}>
        <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 animate-fade-in">
          <div className="aspect-square relative overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name}
              className="object-cover w-full h-full transition-transform hover:scale-105 duration-500 cursor-pointer"
              onClick={handleImageClick}
            />
            {product.originalPrice && (
              <Badge className="absolute top-2 right-2 bg-red-500">
                {t('sale')}
              </Badge>
            )}
          </div>
          
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star 
                  key={index}
                  className={`w-4 h-4 ${
                    index < Math.floor(product.rating) 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
            </div>
            
            <h3 className="font-medium text-lg line-clamp-1">{product.name}</h3>
            
            <div className="flex items-center gap-2 mt-1">
              <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-0 flex flex-col gap-2">
            <Button 
              className="w-full bg-whatsapp hover:bg-whatsapp-dark text-white"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> {t('addToCart')}
            </Button>
            
            {product.payment_link && (
              <div onClick={(e) => e.preventDefault()}>
                <PayNowButton 
                  paymentLink={product.payment_link}
                  productName={product.name}
                  className="w-full"
                />
              </div>
            )}
          </CardFooter>
        </Card>
      </Link>

      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrl={product.image}
        imageAlt={product.name}
      />
    </>
  );
};

export default ProductCard;

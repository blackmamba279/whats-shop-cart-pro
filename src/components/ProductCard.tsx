
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
  const { addItem, getProductQuantityInCart } = useCart();
  const { t } = useLanguage();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  
  // Get quantity in cart for this product
  const quantityInCart = getProductQuantityInCart(product.id);
  
  // Calculate available stock (total stock minus what's in cart)
  const availableStock = (product.stock_quantity || 0) - quantityInCart;
  
  // Check if product is in stock - only disable if no stock available OR explicitly marked as out of stock
  const isInStock = product.inStock && (product.stock_quantity || 0) > 0;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInStock && availableStock > 0) {
      addItem(product);
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsImageModalOpen(true);
  };

  // Show button as disabled only when no stock available at all
  const shouldDisableButton = !isInStock || availableStock <= 0;

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
            {shouldDisableButton && (
              <Badge className="absolute top-2 left-2 bg-gray-500">
                Out of Stock
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
            
            <div className="text-xs text-gray-500 mt-1">
              Stock: {availableStock} available
              {quantityInCart > 0 && (
                <span className="text-blue-600 ml-2">({quantityInCart} in cart)</span>
              )}
            </div>
            
            {product.size && (
              <div className="text-xs text-gray-600 mt-1">
                <span className="font-medium">Talla: </span>{product.size}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="p-4 pt-0 flex flex-col gap-2">
            <Button 
              className={`w-full ${shouldDisableButton ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-whatsapp hover:bg-whatsapp-dark text-white'}`}
              onClick={handleAddToCart}
              disabled={shouldDisableButton}
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> 
              {shouldDisableButton ? 'Out of Stock' : t('addToCart')}
            </Button>
            
            {product.payment_link && !shouldDisableButton && (
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

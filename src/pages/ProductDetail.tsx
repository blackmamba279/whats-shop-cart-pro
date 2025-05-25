
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../data/products';
import { Button } from '../components/ui/button';
import { useCart } from '../contexts/cart-context';
import WhatsAppContact from '../components/WhatsAppContact';
import { ChevronLeft, Star, ShoppingCart, Check } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import ImageModal from '../components/ImageModal';

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const product = getProductById(productId || '');
  const { addItem, items } = useCart();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  
  const isInCart = items.some(item => item.id === product?.id);

  if (!product) {
    return (
      <div className="container py-8 px-4 md:px-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-4">Sorry, the product you are looking for does not exist.</p>
        <Link to="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="container py-8 px-4 md:px-6">
        <Link to="/products" className="inline-flex items-center text-sm mb-6 hover:text-whatsapp">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Products
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative overflow-hidden rounded-lg border">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-auto object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => setIsImageModalOpen(true)}
            />
            {product.originalPrice && (
              <Badge className="absolute top-4 right-4 bg-red-500">
                Sale
              </Badge>
            )}
          </div>
          
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="flex items-center mt-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star 
                    key={index}
                    className={`w-5 h-5 ${
                      index < Math.floor(product.rating) 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-500 ml-2">({product.rating})</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            <div className="border-t border-b py-4">
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-gray-500">
                {product.inStock ? (
                  <span className="text-green-500 flex items-center">
                    <Check className="h-4 w-4 mr-1" /> In Stock
                  </span>
                ) : (
                  <span className="text-red-500">Out of Stock</span>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={() => addItem(product)}
                  className="flex-1 bg-gray-900 hover:bg-gray-700 text-white"
                  disabled={!product.inStock}
                >
                  {isInCart ? (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                    </>
                  )}
                </Button>
                
                <WhatsAppContact
                  product={product}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrl={product.image}
        imageAlt={product.name}
      />
    </>
  );
};

export default ProductDetail;

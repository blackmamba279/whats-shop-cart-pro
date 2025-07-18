
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../data/products';
import { Button } from '../components/ui/button';
import { useCart } from '../contexts/cart-context';
import WhatsAppContact from '../components/WhatsAppContact';
import PayNowButton from '../components/PayNowButton';
import { ChevronLeft, Star, ShoppingCart, Check } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import ImageModal from '../components/ImageModal';

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const product = getProductById(productId || '');
  const { addItem, items, getProductQuantityInCart } = useCart();
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

  // Get quantity in cart for this product
  const quantityInCart = getProductQuantityInCart(product.id);
  
  // Calculate available stock (total stock minus what's in cart)
  const availableStock = (product.stock_quantity || 0) - quantityInCart;
  
  // Check if product is in stock - only disable if no stock available OR explicitly marked as out of stock
  const isInStock = product.inStock && (product.stock_quantity || 0) > 0;
  
  // Show button as disabled only when no stock available at all
  const shouldDisableButton = !isInStock || availableStock <= 0;

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
                {isInStock ? (
                  <span className="text-green-500 flex items-center">
                    <Check className="h-4 w-4 mr-1" /> In Stock
                  </span>
                ) : (
                  <span className="text-red-500">Out of Stock</span>
                )}
                <div className="mt-1">
                  Stock: {availableStock} units available
                  {quantityInCart > 0 && (
                    <span className="text-blue-600 ml-2">({quantityInCart} in cart)</span>
                  )}
                </div>
                {product.size && (
                  <div className="mt-2">
                    <span className="font-medium text-gray-700">Talla: </span>
                    <span className="text-gray-600">{product.size}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    onClick={() => addItem(product)}
                    className={`flex-1 ${shouldDisableButton ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-700 text-white'}`}
                    disabled={shouldDisableButton}
                  >
                    {shouldDisableButton ? (
                      'Out of Stock'
                    ) : isInCart ? (
                      <>
                        <ShoppingCart className="mr-2 h-4 w-4" /> Add More
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
                
                {product.payment_link && !shouldDisableButton && (
                  <PayNowButton 
                    paymentLink={product.payment_link}
                    productName={product.name}
                    className="w-full"
                  />
                )}
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

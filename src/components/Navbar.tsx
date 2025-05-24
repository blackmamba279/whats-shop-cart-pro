
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/cart-context';
import { useLanguage } from '../contexts/language-context';
import { ShoppingCart, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { itemCount } = useCart();
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-whatsapp text-white p-1 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <path d="M8 12h4"></path>
              <path d="M10 10v4"></path>
              <path d="M16 8v.01"></path>
              <path d="M16 12v.01"></path>
              <path d="M16 16v.01"></path>
            </svg>
          </div>
          <span className="font-bold text-xl">WA Shop</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-whatsapp transition-colors">
            {t('home')}
          </Link>
          <Link to="/products" className="text-sm font-medium hover:text-whatsapp transition-colors">
            {t('products')}
          </Link>
          <Link to="/categories" className="text-sm font-medium hover:text-whatsapp transition-colors">
            {t('categories')}
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link to="/admin/login">
            <Button variant="outline" size="icon">
              <Lock className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/cart">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-whatsapp text-white">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

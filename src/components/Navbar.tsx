
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/cart-context';
import { useLanguage } from '../contexts/language-context';
import { ShoppingCart, Lock, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import LanguageSwitcher from './LanguageSwitcher';
import { useIsMobile } from '../hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

const Navbar = () => {
  const { itemCount } = useCart();
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className={`${mobile ? 'flex flex-col space-y-4' : 'hidden md:flex'} items-center gap-6`}>
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
  );

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
          <span className="font-bold text-lg sm:text-xl">BMG Shop Pro</span>
        </Link>
        
        <NavLinks />
        
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          
          <Link to="/admin/login" className="hidden sm:block">
            <Button variant="outline" size="icon">
              <Lock className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </Link>
          
          <Link to="/cart">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 bg-whatsapp text-white text-xs">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>

          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navigation and settings
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-8 space-y-6">
                  <NavLinks mobile />
                  <div className="space-y-4">
                    <LanguageSwitcher />
                    <Link to="/admin/login" className="block">
                      <Button variant="outline" className="w-full">
                        <Lock className="h-4 w-4 mr-2" />
                        Admin Login
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

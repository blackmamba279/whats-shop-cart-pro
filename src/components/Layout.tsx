
import React, { useEffect } from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import WhatsAppContact from './WhatsAppContact';

const Layout = () => {
  useEffect(() => {
    // Load Pagadito certification script for footer
    const timer = setTimeout(() => {
      const existingScript = document.querySelector('script[src*="comercios.pagadito.com/validate"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://comercios.pagadito.com/validate/index.php?merchant=6034e62d2d08eff1a3e05dd0491fbaec&size=s&_idioma=en';
        script.async = true;
        
        const footerCertification = document.getElementById('footer-pagadito-certification');
        if (footerCertification) {
          footerCertification.appendChild(script);
        }
      }
    }, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      
      <footer className="bg-gray-50 py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2">
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
              </div>
              <p className="mt-2 text-gray-500">
                Shop smart and connect directly with sellers through WhatsApp.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-gray-500 hover:text-whatsapp transition-colors">Home</a>
                </li>
                <li>
                  <a href="/products" className="text-gray-500 hover:text-whatsapp transition-colors">Products</a>
                </li>
                <li>
                  <a href="/categories" className="text-gray-500 hover:text-whatsapp transition-colors">Categories</a>
                </li>
                <li>
                  <a href="/cart" className="text-gray-500 hover:text-whatsapp transition-colors">Cart</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Contact Us</h3>
              <p className="text-gray-500">
                Have questions about our products?
              </p>
              <WhatsAppContact className="mt-2" size="sm" useDefaultMessage={true}>
                Chat with us
              </WhatsAppContact>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-center text-gray-500 text-sm mb-4 md:mb-0">
                <p>© {new Date().getFullYear()} WA Shop. All rights reserved.</p>
              </div>
              
              {/* Certified Pagadito Merchant */}
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-2">Certified Pagadito Merchant</div>
                <div id="footer-pagadito-certification" className="min-h-[40px] flex items-center justify-center">
                  <div className="text-xs text-gray-400">Loading certification...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

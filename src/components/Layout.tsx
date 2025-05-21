
import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
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
              <WhatsAppContact className="mt-2" size="sm">
                Chat with us
              </WhatsAppContact>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} WA Shop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

import WhatsAppContact from './WhatsAppContact';
export default Layout;

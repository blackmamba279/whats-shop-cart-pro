
import React from 'react';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import CategoryList from '../components/CategoryList';
import WhatsAppContact from '../components/WhatsAppContact';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <FeaturedProducts />
      <CategoryList />
      
      <section className="py-12 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Need Help?
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Connect with our sales team directly through WhatsApp for personalized assistance.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <WhatsAppContact size="lg" className="w-full">
                Get in Touch via WhatsApp
              </WhatsAppContact>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;

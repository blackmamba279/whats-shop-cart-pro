
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const Hero = () => {
  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Shop Smart, Chat Directly
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl">
                Browse our products and connect instantly with sellers via WhatsApp.
                No complicated checkout processes, just direct and personal shopping.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link to="/products">
                <Button className="bg-whatsapp hover:bg-whatsapp-dark text-white">
                  Browse Products
                </Button>
              </Link>
              <Link to="/categories">
                <Button variant="outline">
                  View Categories
                </Button>
              </Link>
            </div>
          </div>
          <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last">
            <img
              alt="Hero Image"
              className="object-cover w-full h-full"
              src="/placeholder.svg"
              style={{ 
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

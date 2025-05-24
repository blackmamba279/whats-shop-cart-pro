
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/language-context';
import { Button } from './ui/button';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                {t('heroTitle')}
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl">
                {t('heroDescription')}
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link to="/products">
                <Button className="bg-whatsapp hover:bg-whatsapp-dark text-white">
                  {t('browseProducts')}
                </Button>
              </Link>
              <Link to="/categories">
                <Button variant="outline">
                  {t('viewCategories')}
                </Button>
              </Link>
            </div>
          </div>
          <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last">
            <img
              alt="Hero Image"
              className="object-cover w-full h-full"
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
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

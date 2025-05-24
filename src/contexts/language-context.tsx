
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    // Navigation
    home: 'Home',
    products: 'Products',
    categories: 'Categories',
    cart: 'Cart',
    
    // Hero Section
    heroTitle: 'Shop Smart, Chat Directly',
    heroDescription: 'Browse our products and connect instantly with sellers via WhatsApp. No complicated checkout processes, just direct and personal shopping.',
    browseProducts: 'Browse Products',
    viewCategories: 'View Categories',
    
    // Featured Products
    featuredProducts: 'Featured Products',
    featuredDescription: 'Check out our most popular items loved by customers',
    
    // Categories
    shopByCategory: 'Shop by Category',
    categoryDescription: 'Find exactly what you\'re looking for by browsing our product categories',
    allCategories: 'All Categories',
    backToCategories: 'Back to Categories',
    categoryNotFound: 'Category Not Found',
    categoryNotFoundDescription: 'Sorry, the category you are looking for does not exist.',
    goToCategories: 'Go to Categories',
    
    // Products
    allProducts: 'All Products',
    addToCart: 'Add to Cart',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    noProductsInCategory: 'No products in this category yet',
    checkBackSoon: 'Check back soon for new additions!',
    
    // General
    noProductsAvailable: 'No products available',
    noCategoriesAvailable: 'No categories available',
    loading: 'Loading...',
    sale: 'Sale',
    
    // Contact
    needHelp: 'Need Help?',
    contactDescription: 'Connect with our sales team directly through WhatsApp for personalized assistance.',
    getInTouch: 'Get in Touch via WhatsApp',
    chatWithUs: 'Chat with us'
  },
  es: {
    // Navigation
    home: 'Inicio',
    products: 'Productos',
    categories: 'Categorías',
    cart: 'Carrito',
    
    // Hero Section
    heroTitle: 'Compra Inteligente, Chatea Directamente',
    heroDescription: 'Navega por nuestros productos y conecta instantáneamente con vendedores vía WhatsApp. Sin procesos complicados de compra, solo compras directas y personales.',
    browseProducts: 'Ver Productos',
    viewCategories: 'Ver Categorías',
    
    // Featured Products
    featuredProducts: 'Productos Destacados',
    featuredDescription: 'Descubre nuestros artículos más populares amados por los clientes',
    
    // Categories
    shopByCategory: 'Comprar por Categoría',
    categoryDescription: 'Encuentra exactamente lo que buscas navegando por nuestras categorías de productos',
    allCategories: 'Todas las Categorías',
    backToCategories: 'Volver a Categorías',
    categoryNotFound: 'Categoría No Encontrada',
    categoryNotFoundDescription: 'Lo sentimos, la categoría que buscas no existe.',
    goToCategories: 'Ir a Categorías',
    
    // Products
    allProducts: 'Todos los Productos',
    addToCart: 'Añadir al Carrito',
    inStock: 'En Stock',
    outOfStock: 'Agotado',
    noProductsInCategory: 'Aún no hay productos en esta categoría',
    checkBackSoon: '¡Vuelve pronto para nuevas adiciones!',
    
    // General
    noProductsAvailable: 'No hay productos disponibles',
    noCategoriesAvailable: 'No hay categorías disponibles',
    loading: 'Cargando...',
    sale: 'Oferta',
    
    // Contact
    needHelp: '¿Necesitas Ayuda?',
    contactDescription: 'Conecta con nuestro equipo de ventas directamente a través de WhatsApp para asistencia personalizada.',
    getInTouch: 'Contáctanos vía WhatsApp',
    chatWithUs: 'Chatea con nosotros'
  },
  zh: {
    // Navigation
    home: '首页',
    products: '产品',
    categories: '分类',
    cart: '购物车',
    
    // Hero Section
    heroTitle: '智能购物，直接聊天',
    heroDescription: '浏览我们的产品，通过WhatsApp与卖家即时联系。没有复杂的结账流程，只有直接和个性化的购物体验。',
    browseProducts: '浏览产品',
    viewCategories: '查看分类',
    
    // Featured Products
    featuredProducts: '精选产品',
    featuredDescription: '查看我们最受客户喜爱的热门商品',
    
    // Categories
    shopByCategory: '按分类购物',
    categoryDescription: '通过浏览我们的产品分类找到您要寻找的确切商品',
    allCategories: '所有分类',
    backToCategories: '返回分类',
    categoryNotFound: '未找到分类',
    categoryNotFoundDescription: '抱歉，您要查找的分类不存在。',
    goToCategories: '前往分类',
    
    // Products
    allProducts: '所有产品',
    addToCart: '加入购物车',
    inStock: '有库存',
    outOfStock: '缺货',
    noProductsInCategory: '此分类暂无产品',
    checkBackSoon: '请稍后查看新产品！',
    
    // General
    noProductsAvailable: '暂无产品',
    noCategoriesAvailable: '暂无分类',
    loading: '加载中...',
    sale: '促销',
    
    // Contact
    needHelp: '需要帮助？',
    contactDescription: '通过WhatsApp直接联系我们的销售团队获得个性化帮助。',
    getInTouch: '通过WhatsApp联系',
    chatWithUs: '与我们聊天'
  },
  pt: {
    // Navigation
    home: 'Início',
    products: 'Produtos',
    categories: 'Categorias',
    cart: 'Carrinho',
    
    // Hero Section
    heroTitle: 'Compre Inteligente, Converse Diretamente',
    heroDescription: 'Navegue pelos nossos produtos e conecte-se instantaneamente com vendedores via WhatsApp. Sem processos complicados de checkout, apenas compras diretas e pessoais.',
    browseProducts: 'Ver Produtos',
    viewCategories: 'Ver Categorias',
    
    // Featured Products
    featuredProducts: 'Produtos em Destaque',
    featuredDescription: 'Confira nossos itens mais populares amados pelos clientes',
    
    // Categories
    shopByCategory: 'Comprar por Categoria',
    categoryDescription: 'Encontre exatamente o que você está procurando navegando pelas nossas categorias de produtos',
    allCategories: 'Todas as Categorias',
    backToCategories: 'Voltar às Categorias',
    categoryNotFound: 'Categoria Não Encontrada',
    categoryNotFoundDescription: 'Desculpe, a categoria que você está procurando não existe.',
    goToCategories: 'Ir para Categorias',
    
    // Products
    allProducts: 'Todos os Produtos',
    addToCart: 'Adicionar ao Carrinho',
    inStock: 'Em Estoque',
    outOfStock: 'Fora de Estoque',
    noProductsInCategory: 'Ainda não há produtos nesta categoria',
    checkBackSoon: 'Volte em breve para novas adições!',
    
    // General
    noProductsAvailable: 'Nenhum produto disponível',
    noCategoriesAvailable: 'Nenhuma categoria disponível',
    loading: 'Carregando...',
    sale: 'Promoção',
    
    // Contact
    needHelp: 'Precisa de Ajuda?',
    contactDescription: 'Conecte-se com nossa equipe de vendas diretamente através do WhatsApp para assistência personalizada.',
    getInTouch: 'Entre em Contato via WhatsApp',
    chatWithUs: 'Converse conosco'
  },
  it: {
    // Navigation
    home: 'Home',
    products: 'Prodotti',
    categories: 'Categorie',
    cart: 'Carrello',
    
    // Hero Section
    heroTitle: 'Acquista Smart, Chatta Direttamente',
    heroDescription: 'Sfoglia i nostri prodotti e connettiti istantaneamente con i venditori tramite WhatsApp. Nessun processo di checkout complicato, solo shopping diretto e personale.',
    browseProducts: 'Sfoglia Prodotti',
    viewCategories: 'Visualizza Categorie',
    
    // Featured Products
    featuredProducts: 'Prodotti in Evidenza',
    featuredDescription: 'Scopri i nostri articoli più popolari amati dai clienti',
    
    // Categories
    shopByCategory: 'Acquista per Categoria',
    categoryDescription: 'Trova esattamente quello che stai cercando sfogliando le nostre categorie di prodotti',
    allCategories: 'Tutte le Categorie',
    backToCategories: 'Torna alle Categorie',
    categoryNotFound: 'Categoria Non Trovata',
    categoryNotFoundDescription: 'Spiacenti, la categoria che stai cercando non esiste.',
    goToCategories: 'Vai alle Categorie',
    
    // Products
    allProducts: 'Tutti i Prodotti',
    addToCart: 'Aggiungi al Carrello',
    inStock: 'Disponibile',
    outOfStock: 'Esaurito',
    noProductsInCategory: 'Ancora nessun prodotto in questa categoria',
    checkBackSoon: 'Torna presto per nuove aggiunte!',
    
    // General
    noProductsAvailable: 'Nessun prodotto disponibile',
    noCategoriesAvailable: 'Nessuna categoria disponibile',
    loading: 'Caricamento...',
    sale: 'Saldo',
    
    // Contact
    needHelp: 'Hai Bisogno di Aiuto?',
    contactDescription: 'Connettiti con il nostro team di vendita direttamente tramite WhatsApp per assistenza personalizzata.',
    getInTouch: 'Contattaci via WhatsApp',
    chatWithUs: 'Chatta con noi'
  }
};

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

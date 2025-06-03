export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  category: string;
  inStock: boolean;
  featured: boolean;
  rating: number;
  stock_quantity?: number;
  payment_link?: string;
  size?: string; // New field for product size
}

export interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: "smartphones",
    name: "Smartphones",
    image: "/placeholder.svg",
    description: "Latest smartphones with amazing features",
  },
  {
    id: "laptops",
    name: "Laptops",
    image: "/placeholder.svg",
    description: "Powerful laptops for work and gaming",
  },
  {
    id: "accessories",
    name: "Accessories",
    image: "/placeholder.svg",
    description: "Essential accessories for your devices",
  },
  {
    id: "wearables",
    name: "Wearables",
    image: "/placeholder.svg",
    description: "Smart watches and fitness trackers",
  },
];

export const products: Product[] = [
  {
    id: "iphone-13-pro",
    name: "iPhone 13 Pro",
    price: 999,
    description: "The latest iPhone with pro camera system and super Retina XDR display with ProMotion.",
    image: "/placeholder.svg",
    category: "smartphones",
    inStock: true,
    featured: true,
    rating: 4.9,
    stock_quantity: 15,
  },
  {
    id: "samsung-galaxy-s21",
    name: "Samsung Galaxy S21",
    price: 799,
    originalPrice: 899,
    description: "Galaxy S21 with 5G capability, 8K video and dynamic AMOLED display.",
    image: "/placeholder.svg",
    category: "smartphones",
    inStock: true,
    rating: 4.7,
    stock_quantity: 8,
  },
  {
    id: "macbook-pro-m1",
    name: "MacBook Pro M1",
    price: 1299,
    description: "Apple MacBook Pro with M1 chip, 13-inch Retina display, and up to 20 hours of battery life.",
    image: "/placeholder.svg",
    category: "laptops",
    inStock: true,
    featured: true,
    rating: 4.8,
    stock_quantity: 5,
  },
  {
    id: "dell-xps-13",
    name: "Dell XPS 13",
    price: 999,
    originalPrice: 1099,
    description: "Dell XPS 13 with InfinityEdge display, 11th Gen Intel Core processors, and long battery life.",
    image: "/placeholder.svg",
    category: "laptops",
    inStock: true,
    rating: 4.6,
    stock_quantity: 12,
  },
  {
    id: "airpods-pro",
    name: "AirPods Pro",
    price: 249,
    description: "Active noise cancellation, transparency mode, and adaptive EQ for an immersive listening experience.",
    image: "/placeholder.svg",
    category: "accessories",
    inStock: true,
    rating: 4.7,
    stock_quantity: 0, // This will make the product out of stock
  },
  {
    id: "samsung-galaxy-watch4",
    name: "Samsung Galaxy Watch4",
    price: 249.99,
    description: "Advanced health monitoring, fitness tracking, and smart features in a stylish design.",
    image: "/placeholder.svg",
    category: "wearables",
    inStock: true,
    rating: 4.5,
    stock_quantity: 7,
  },
  {
    id: "logitech-mx-master-3",
    name: "Logitech MX Master 3",
    price: 99.99,
    description: "Advanced wireless mouse with electromagnetic scrolling and app-specific customizations.",
    image: "/placeholder.svg",
    category: "accessories",
    inStock: true,
    rating: 4.8,
    stock_quantity: 20,
  },
  {
    id: "apple-watch-series-7",
    name: "Apple Watch Series 7",
    price: 399,
    description: "Always-On Retina display, crack-resistant front crystal, and advanced health features.",
    image: "/placeholder.svg",
    category: "wearables",
    inStock: true,
    featured: true,
    rating: 4.9,
    stock_quantity: 3,
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (categoryId: string): Product[] => {
  return products.filter(product => product.category === categoryId);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

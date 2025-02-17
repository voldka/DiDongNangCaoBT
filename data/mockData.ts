export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

export const categories: Category[] = [
  { id: '1', name: 'Accessories', icon: '👜' },
  { id: '2', name: 'Home Decor', icon: '🏠' },
  { id: '3', name: 'Jewelry', icon: '💍' },
  { id: '4', name: 'Art', icon: '🎨' },
  { id: '5', name: 'Pottery', icon: '🏺' },
  // Additional sample categories
  { id: '6', name: 'Clothing', icon: '👗' },
  { id: '7', name: 'Footwear', icon: '👟' },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Handmade Leather Bag',
    price: 89.99,
    image: 'https://picsum.photos/id/1/200',
    category: '1',
    description: 'Beautiful handcrafted leather bag with detailed stitching'
  },
  {
    id: '2',
    name: 'Ceramic Vase',
    price: 45.99,
    image: 'https://picsum.photos/id/2/200',
    category: '2',
    description: 'Modern ceramic vase perfect for any home'
  },
  {
    id: '3',
    name: 'Silver Necklace',
    price: 129.99,
    image: 'https://picsum.photos/id/3/200',
    category: '3',
    description: 'Handcrafted silver necklace with unique design'
  },
  {
    id: '4',
    name: 'Wooden Wall Art',
    price: 159.99,
    image: 'https://picsum.photos/id/4/200',
    category: '4',
    description: 'Modern wooden wall art piece'
  },
  {
    id: '5',
    name: 'Clay Tea Set',
    price: 79.99,
    image: 'https://picsum.photos/id/5/200',
    category: '5',
    description: 'Traditional handmade clay tea set'
  },
  // Additional sample products
  {
    id: '6',
    name: 'Elegant Silk Scarf',
    price: 39.99,
    image: 'https://picsum.photos/id/6/200',
    category: '1',
    description: 'Luxurious silk scarf with vibrant patterns'
  },
  {
    id: '7',
    name: 'Modern Lamp',
    price: 59.99,
    image: 'https://picsum.photos/id/7/200',
    category: '2',
    description: 'Contemporary lamp design to lighten up your home'
  },
  {
    id: '8',
    name: 'Gold Bracelet',
    price: 199.99,
    image: 'https://picsum.photos/id/8/200',
    category: '3',
    description: 'Stunning gold bracelet with intricate craftsmanship'
  },
  {
    id: '9',
    name: 'Abstract Painting',
    price: 299.99,
    image: 'https://picsum.photos/id/9/200',
    category: '4',
    description: 'Colorful abstract painting for a modern vibe'
  },
  {
    id: '10',
    name: 'Vintage Dress',
    price: 89.99,
    image: 'https://picsum.photos/id/10/200',
    category: '6',
    description: 'Elegant vintage dress with a classic cut'
  },
];

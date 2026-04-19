export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  isNew?: boolean;
  isLimited?: boolean;
  shape?: string;
  tags?: string[];
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Midnight Flora',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=800',
    category: 'press-ons',
    description: 'Hand-painted matte black press-on nails with delicate floral patterns in white ink, high fashion aesthetic.',
    isLimited: true,
    shape: 'Almond',
    tags: ['Hand-painted', 'Matte']
  },
  {
    id: '2',
    name: 'Rose Quartz Chrome',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1604654894610-df490c985507?auto=format&fit=crop&q=80&w=800',
    category: 'gels',
    description: 'A translucent, ethereal glaze that mimics the soft fracturing of natural rose quartz. Infused with micro-chrome pigments.',
    tags: ['Chrome', 'Vegan']
  },
  {
    id: '3',
    name: 'Modern Muse Tips',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&q=80&w=800',
    category: 'press-ons',
    description: 'Classic french tip nails with a modern pearl accent on the ring finger, clean and sophisticated aesthetic.',
    shape: 'Square',
    tags: ['Classic', 'Pearl']
  },
  {
    id: '4',
    name: 'Prism Glitch',
    price: 2199,
    image: 'https://images.unsplash.com/photo-1594465919760-441fe5908ab0?auto=format&fit=crop&q=80&w=800',
    category: 'gels',
    description: 'Vibrant holographic nails reflecting a rainbow spectrum of colors under direct light.',
    isNew: true,
    tags: ['Holographic', 'High Shine']
  },
  {
    id: '5',
    name: 'The Ghost Set',
    price: 2899,
    image: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&q=80&w=800',
    category: 'press-ons',
    description: 'Translucent milky white press-on nails with silver chrome tip detailing.',
    shape: 'Coffin',
    tags: ['Translucent', 'Chrome']
  },
  {
    id: '6',
    name: 'Artisan Tool Set',
    price: 12999,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800',
    category: 'tools',
    description: 'A curated selection of precision instruments designed for the modern nail artist.',
    tags: ['Professional', 'Japanese Steel']
  },
  {
    id: '7',
    name: 'Celestial Veil',
    price: 2699,
    image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=800',
    category: 'press-ons',
    description: 'Deep midnight navy base with hand-applied gold leaf constellations. A cosmic masterpiece for the evening.',
    isLimited: true,
    tags: ['Hand-painted', 'Gold Leaf', 'Midnight']
  },
  {
    id: '8',
    name: 'Onyx Marble',
    price: 2399,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
    category: 'press-ons',
    description: 'Sophisticated black and white marble veins with a soft-touch matte finish. Minimalist luxury.',
    tags: ['Marble', 'Matte', 'Monochrome']
  },
  {
    id: '9',
    name: 'Liquid Gold Liner',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1526045612212-70caf35c117f?auto=format&fit=crop&q=80&w=800',
    category: 'gels',
    description: 'Ultra-high pigment metallic gold gel. Perfect for precision line work and architectural accents.',
    tags: ['Metallic', 'Precision', 'Professional']
  },
  {
    id: '10',
    name: 'Glass Skin Glaze',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
    category: 'gels',
    description: 'A revolutionary high-gloss top coat that provides a "wet look" finish with extreme durability.',
    isNew: true,
    tags: ['High Shine', 'Long-wear', 'Vegan']
  }
];

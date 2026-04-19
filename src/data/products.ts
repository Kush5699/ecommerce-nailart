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
    price: 34.00,
    image: 'https://picsum.photos/seed/nail1/800/800',
    category: 'press-ons',
    description: 'Hand-painted matte black press-on nails with delicate floral patterns in white ink, high fashion aesthetic.',
    isLimited: true,
    shape: 'Almond',
    tags: ['Hand-painted', 'Matte']
  },
  {
    id: '2',
    name: 'Rose Quartz Chrome',
    price: 28.00,
    image: 'https://picsum.photos/seed/nail2/800/800',
    category: 'gels',
    description: 'A translucent, ethereal glaze that mimics the soft fracturing of natural rose quartz. Infused with micro-chrome pigments.',
    tags: ['Chrome', 'Vegan']
  },
  {
    id: '3',
    name: 'Modern Muse Tips',
    price: 32.00,
    image: 'https://picsum.photos/seed/nail3/800/800',
    category: 'press-ons',
    description: 'Classic french tip nails with a modern pearl accent on the ring finger, clean and sophisticated aesthetic.',
    shape: 'Square',
    tags: ['Classic', 'Pearl']
  },
  {
    id: '4',
    name: 'Prism Glitch',
    price: 36.00,
    image: 'https://picsum.photos/seed/nail4/800/800',
    category: 'gels',
    description: 'Vibrant holographic nails reflecting a rainbow spectrum of colors under direct light.',
    isNew: true,
    tags: ['Holographic', 'High Shine']
  },
  {
    id: '5',
    name: 'The Ghost Set',
    price: 42.00,
    image: 'https://picsum.photos/seed/nail5/800/800',
    category: 'press-ons',
    description: 'Translucent milky white press-on nails with silver chrome tip detailing.',
    shape: 'Coffin',
    tags: ['Translucent', 'Chrome']
  },
  {
    id: '6',
    name: 'Artisan Tool Set',
    price: 185.00,
    image: 'https://picsum.photos/seed/nail6/800/800',
    category: 'tools',
    description: 'A curated selection of precision instruments designed for the modern nail artist.',
    tags: ['Professional', 'Japanese Steel']
  },
  {
    id: '7',
    name: 'Celestial Veil',
    price: 38.00,
    image: 'https://picsum.photos/seed/nail7/800/800',
    category: 'press-ons',
    description: 'Deep midnight navy base with hand-applied gold leaf constellations. A cosmic masterpiece for the evening.',
    isLimited: true,
    tags: ['Hand-painted', 'Gold Leaf', 'Midnight']
  },
  {
    id: '8',
    name: 'Onyx Marble',
    price: 35.00,
    image: 'https://picsum.photos/seed/nail8/800/800',
    category: 'press-ons',
    description: 'Sophisticated black and white marble veins with a soft-touch matte finish. Minimalist luxury.',
    tags: ['Marble', 'Matte', 'Monochrome']
  },
  {
    id: '9',
    name: 'Liquid Gold Liner',
    price: 24.00,
    image: 'https://picsum.photos/seed/nail9/800/800',
    category: 'gels',
    description: 'Ultra-high pigment metallic gold gel. Perfect for precision line work and architectural accents.',
    tags: ['Metallic', 'Precision', 'Professional']
  },
  {
    id: '10',
    name: 'Glass Skin Glaze',
    price: 22.00,
    image: 'https://picsum.photos/seed/nail10/800/800',
    category: 'gels',
    description: 'A revolutionary high-gloss top coat that provides a "wet look" finish with extreme durability.',
    isNew: true,
    tags: ['High Shine', 'Long-wear', 'Vegan']
  }
];

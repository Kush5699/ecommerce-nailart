import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import ProductCard from '@/src/components/product/ProductCard';
import { db } from '@/src/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { products as initialProducts } from '@/src/data/products';

export default function Collections() {
  const { category } = useParams<{ category: string }>();
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let q;
    if (category === 'trending') {
      q = query(collection(db, 'products'), where('isLimited', '==', true));
    } else if (category) {
      q = query(collection(db, 'products'), where('category', '==', category));
    } else {
      q = query(collection(db, 'products'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setFilteredProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [category]);

  const displayProducts = filteredProducts.length > 0 ? filteredProducts : initialProducts.filter(p => {
    if (category === 'trending') return p.isLimited;
    if (category) return p.category === category;
    return true;
  });

  const categoryTitles: Record<string, string> = {
    'trending': 'Trending Now',
    'press-ons': 'Press-on Poetry',
    'gels': 'Artisan Gels',
    'tools': 'Precision Tools'
  };

  const categorySubtitles: Record<string, string> = {
    'trending': "The season's most-wanted artistry.",
    'press-ons': 'Wearable art for the modern muse.',
    'gels': 'Studio-grade pigments and finishes.',
    'tools': 'Professional instruments for the atelier.'
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-20">
      <header className="mb-20">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold mb-4"
        >
          L'Artiste Collection
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-serif tracking-tighter leading-none mb-6"
        >
          {categoryTitles[category || ''] || 'Collections'}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground text-lg max-w-xl"
        >
          {categorySubtitles[category || ''] || 'Explore our curated selections.'}
        </motion.p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
        {displayProducts.map((product: any) => (
          <ProductCard 
            key={product.id} 
            {...product}
          />
        ))}
      </div>

      {displayProducts.length === 0 && (
        <div className="py-40 text-center">
          <p className="text-muted-foreground font-serif italic text-2xl">Coming soon to the atelier.</p>
        </div>
      )}
    </div>
  );
}

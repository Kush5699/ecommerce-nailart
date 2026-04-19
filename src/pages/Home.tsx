import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '@/src/components/product/ProductCard';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/src/components/CartProvider';
import { db } from '@/src/lib/firebase';
import { collection, query, limit, onSnapshot } from 'firebase/firestore';
import LazyImage from '@/src/components/common/LazyImage';
import { products as initialProducts } from '@/src/data/products';

export default function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'products'), limit(4));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTrendingProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddToBag = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    const product = trendingProducts.find(p => p.id === productId) || 
                   initialProducts.find(p => p.id === productId);
    if (product) {
      addToCart(product);
    }
  };

  const displayProducts = trendingProducts.length > 0 ? trendingProducts : initialProducts.slice(0, 4);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[700px] flex items-center bg-muted/30">
        <div className="grid grid-cols-1 lg:grid-cols-12 w-full h-full">
          <div className="col-span-1 lg:col-span-7 relative overflow-hidden">
            <LazyImage 
              src="https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=1200" 
              alt="Hero Nail Art"
              className="w-full h-full"
            />
            <div className="absolute inset-0 bg-primary/5"></div>
          </div>
          <div className="col-span-1 lg:col-span-5 flex flex-col justify-center px-12 lg:px-24 bg-background z-10">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="text-[10px] uppercase tracking-[0.4em] font-medium text-primary mb-6 block"
            >
              Summer Editorial 2024
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-6xl md:text-8xl font-serif text-foreground leading-[0.9] -ml-12 md:-ml-24 drop-shadow-sm"
            >
              The Tactile <br/><i className="font-normal italic">Ethereal</i>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-10 text-muted-foreground max-w-sm leading-relaxed text-lg"
            >
              A curated selection of hand-crafted press-ons and artisan gels designed for the modern curator. Artistry at your fingertips.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="mt-12"
            >
              <Link to="/collections/trending">
                <button className="bg-primary text-on-primary px-12 py-5 rounded-none text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-primary/90 transition-all shadow-xl active:scale-95">
                  Shop the Look
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Deals of the Day */}
      <section className="py-32 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-border/40 pb-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">Deals of the Day</h2>
            <p className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Limited editions ending soon</p>
          </div>
          <div className="flex gap-4 mt-8 md:mt-0">
            {['08', '42', '15'].map((val, i) => (
              <div key={i} className="bg-primary-container text-on-primary-container px-6 py-3 flex flex-col items-center min-w-[80px]">
                <span className="text-2xl font-bold">{val}</span>
                <span className="text-[8px] uppercase tracking-widest font-bold">{['Hrs', 'Min', 'Sec'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div 
            whileHover={{ y: -10 }}
            onClick={() => navigate('/product/5')}
            className="flex flex-col md:flex-row gap-8 items-center bg-muted/20 p-8 group cursor-pointer"
          >
            <div className="w-full md:w-1/2 aspect-square overflow-hidden">
              <LazyImage 
                src="https://images.unsplash.com/photo-1594465919760-441fe5908ab0?auto=format&fit=crop&q=80&w=800" 
                alt="Flash Sale" 
                className="group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <Badge className="bg-secondary-container text-on-secondary-container rounded-full text-[8px] uppercase font-bold px-3 py-1">Flash Sale</Badge>
              <h3 className="text-2xl font-serif">The Ghost Set</h3>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-primary">$42.00</span>
                <span className="text-sm text-muted-foreground line-through">$68.00</span>
              </div>
              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-[8px] uppercase tracking-widest font-bold text-muted-foreground">
                  <span>Stock Remaining</span>
                  <span>12 left</span>
                </div>
                <div className="w-full h-1 bg-muted overflow-hidden">
                  <div className="bg-primary h-full w-[15%]"></div>
                </div>
              </div>
              <button 
                onClick={(e) => handleAddToBag(e, '5')}
                className="mt-4 text-primary text-[10px] uppercase tracking-[0.2em] font-bold border-b border-primary/20 pb-1 hover:border-primary transition-all"
              >
                Add to Bag
              </button>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -10 }}
            onClick={() => navigate('/product/6')}
            className="flex flex-col md:flex-row gap-8 items-center bg-muted/20 p-8 group cursor-pointer"
          >
            <div className="w-full md:w-1/2 aspect-square overflow-hidden">
              <LazyImage 
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800" 
                alt="Daily Pick" 
                className="group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <Badge className="bg-secondary-container text-on-secondary-container rounded-full text-[8px] uppercase font-bold px-3 py-1">Daily Pick</Badge>
              <h3 className="text-2xl font-serif">Artisan Tool Set</h3>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-primary">$89.00</span>
                <span className="text-sm text-muted-foreground line-through">$125.00</span>
              </div>
              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-[8px] uppercase tracking-widest font-bold text-muted-foreground">
                  <span>Stock Remaining</span>
                  <span>5 left</span>
                </div>
                <div className="w-full h-1 bg-muted overflow-hidden">
                  <div className="bg-primary h-full w-[8%]"></div>
                </div>
              </div>
              <button 
                onClick={(e) => handleAddToBag(e, '6')}
                className="mt-4 text-primary text-[10px] uppercase tracking-[0.2em] font-bold border-b border-primary/20 pb-1 hover:border-primary transition-all"
              >
                Add to Bag
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-primary-container/20 py-32">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
          <h2 className="text-5xl font-serif text-center mb-24">Curated Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Press-ons', subtitle: "Featuring Monica's Way", img: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=800', count: '24 Styles', href: '/collections/press-ons' },
              { title: 'Gel Polishes', subtitle: 'The Pro-Finish Series', img: 'https://images.unsplash.com/photo-1526045612212-70caf35c117f?auto=format&fit=crop&q=80&w=800', count: '112 Tones', offset: true, href: '/collections/gels' },
              { title: 'Nail Care', subtitle: 'Nourish & Restore', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800', count: 'Essential Rituals', href: '/collections/tools' }
            ].map((cat, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                onClick={() => navigate(cat.href)}
                className={`group cursor-pointer ${cat.offset ? 'md:mt-24' : ''}`}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-muted shadow-lg">
                  <LazyImage 
                    src={cat.img} 
                    alt={cat.title} 
                    className="group-hover:scale-110 transition-transform duration-[2s]"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  <div className="absolute bottom-10 left-10">
                    <h3 className="text-4xl font-serif text-white drop-shadow-md">{cat.title}</h3>
                    <p className="text-white/90 text-[10px] uppercase tracking-[0.3em] mt-3 font-bold">{cat.subtitle}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-8 px-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">{cat.count}</span>
                  <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-2 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Now Grid */}
      <section className="py-32 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-6xl font-serif mb-6">Trending Now</h2>
          <div className="w-24 h-[1px] bg-primary/30 mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
          {displayProducts.map((product: any) => (
            <ProductCard 
              key={product.id} 
              {...product}
            />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-muted/30 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
          <div className="flex justify-between items-center mb-20">
            <h2 className="text-4xl font-serif">Shared by You</h2>
            <div className="flex gap-4">
              <button className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all">
                ←
              </button>
              <button className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all">
                →
              </button>
            </div>
          </div>
          <div className="flex gap-10 overflow-x-auto pb-12 snap-x no-scrollbar">
            {[
              { name: 'Elena A.', text: "Absolutely stunned by the quality. They stayed on for 2 weeks straight and looked like a salon visit!", img: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=400' },
              { name: 'Jessica S.', text: "The Opaline kit is a game changer. The finish is so multi-dimensional, I get compliments everywhere.", img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400' },
              { name: 'Maria L.', text: "Luxury at its finest. The packaging alone makes it feel like a gift every time I order.", img: 'https://images.unsplash.com/photo-1594465919760-441fe5908ab0?auto=format&fit=crop&q=80&w=400' }
            ].map((rev, i) => (
              <div key={i} className="min-w-[350px] snap-start bg-background p-8 shadow-sm">
                <div className="aspect-square rounded-none overflow-hidden mb-8">
                  <LazyImage src={rev.img} alt={rev.name} />
                </div>
                <div className="flex gap-1 mb-6 text-primary">
                  {[...Array(5)].map((_, j) => <span key={j}>★</span>)}
                </div>
                <p className="text-sm italic text-muted-foreground mb-8 leading-relaxed">"{rev.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-container text-primary flex items-center justify-center text-xs font-bold">
                    {rev.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold">{rev.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

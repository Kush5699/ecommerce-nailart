import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useCart } from '@/src/components/CartProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Share2, Heart } from 'lucide-react';
import { db } from '@/src/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import LazyImage from '@/src/components/common/LazyImage';
import { products as initialProducts } from '@/src/data/products';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          // Fallback to initial data
          const fallback = initialProducts.find(p => p.id === id);
          if (fallback) setProduct(fallback);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        // Fallback to initial data on error
        const fallback = initialProducts.find(p => p.id === id);
        if (fallback) setProduct(fallback);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="py-40 text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-serif italic text-xl text-muted-foreground">Revealing the Masterpiece...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-40 text-center">
        <h2 className="text-3xl font-serif mb-4">Product not found</h2>
        <Link to="/" className="text-primary underline">Return Home</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
      category: product.category
    });
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
        {/* Product Gallery */}
        <div className="lg:col-span-7 space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-[4/5] overflow-hidden bg-muted shadow-sm"
          >
            <LazyImage 
              src={product.image} 
              alt={product.name}
            />
            <div className="absolute bottom-6 left-6 flex gap-2">
              {product.tags?.map(tag => (
                <Badge key={tag} className="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase font-label border-none">
                  {tag}
                </Badge>
              ))}
            </div>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="aspect-square bg-muted overflow-hidden">
              <LazyImage 
                src={product.image} 
                alt="Detail 1" 
                className="opacity-80"
              />
            </div>
            <div className="aspect-square bg-muted overflow-hidden translate-y-8">
              <LazyImage 
                src={product.image} 
                alt="Detail 2" 
                className="opacity-80"
              />
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:col-span-5 lg:sticky lg:top-36 space-y-10">
          <header className="space-y-4">
            <div className="flex items-center gap-4">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">
                {product.category} No. {product.id.padStart(2, '0')}
              </p>
              <div className="h-[1px] flex-grow bg-border/30"></div>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif italic leading-tight tracking-tighter">
              {product.name}
            </h1>
            <p className="text-2xl font-light text-muted-foreground">${product.price.toFixed(2)}</p>
          </header>

          <div className="space-y-6">
            <p className="text-muted-foreground leading-relaxed text-lg max-w-md">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="pt-4 flex items-center gap-8">
              <div className="flex items-center border-b border-border/40 pb-2 gap-8">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="hover:text-primary transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-sm px-2">{quantity.toString().padStart(2, '0')}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="hover:text-primary transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                In Stock — Limited Release
              </p>
            </div>

            {/* Add to Cart CTA */}
            <div className="pt-4">
              <Button 
                onClick={handleAddToCart}
                className="w-full py-8 bg-primary text-on-primary rounded-none text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-primary/90 transition-all shadow-xl active:scale-[0.98]"
              >
                Add to Cart
              </Button>
            </div>
          </div>

          {/* Product Specifications */}
          <div className="pt-8 border-t border-border/20 space-y-6">
            <div className="flex justify-between items-center">
              <span className="font-serif italic text-lg">Viscosity</span>
              <span className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold">Medium-Fluid</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-serif italic text-lg">Dry Time</span>
              <span className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold">60s LED / 120s UV</span>
            </div>
            <div className="space-y-3">
              <span className="font-serif italic text-lg block">Ingredients</span>
              <p className="text-[10px] text-muted-foreground/80 leading-relaxed uppercase tracking-wider">
                Acrylates Copolymer, Hydroxypropyl Methacrylate, Trimethylbenzoyl Diphenylphosphine Oxide, Ethyl Trimethylbenzoyl Phenylphosphinate, Silica, Mineral Pigments.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Actions (Desktop) */}
      <div className="hidden md:flex fixed bottom-12 right-12 flex-col gap-4 z-40">
        <button className="bg-background text-primary p-4 rounded-full shadow-xl hover:scale-105 transition-transform border border-border/20">
          <Share2 className="w-5 h-5" />
        </button>
        <button className="bg-background text-primary p-4 rounded-full shadow-xl hover:scale-105 transition-transform border border-border/20">
          <Heart className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/src/components/CartProvider';

import LazyImage from '@/src/components/common/LazyImage';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
  isLimited?: boolean;
}

export default function ProductCard({ id, name, price, image, category, isNew, isLimited }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id, name, price, image, category, quantity: 1 });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group flex flex-col space-y-6"
    >
      <Link to={`/product/${id}`} className="relative aspect-[4/5] bg-muted overflow-hidden">
        <LazyImage 
          src={image} 
          alt={name}
          className="transition-transform duration-700 group-hover:scale-105"
        />
        {isNew && (
          <Badge className="absolute top-4 right-4 bg-primary text-on-primary rounded-none uppercase tracking-widest text-[8px] px-3 py-1">
            New Arrival
          </Badge>
        )}
        {isLimited && (
          <Badge className="absolute top-4 left-4 bg-secondary text-on-secondary rounded-none uppercase tracking-widest text-[8px] px-3 py-1">
            Limited Edition
          </Badge>
        )}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-primary text-on-primary py-3 text-[10px] uppercase tracking-[0.2em] font-bold shadow-xl hover:bg-primary/90 transition-all"
          >
            Add to Bag
          </button>
        </div>
      </Link>
      
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-serif text-lg text-foreground group-hover:text-primary transition-colors">{name}</h4>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{category}</p>
        </div>
        <span className="font-medium text-primary">${price.toFixed(2)}</span>
      </div>
    </motion.div>
  );
}

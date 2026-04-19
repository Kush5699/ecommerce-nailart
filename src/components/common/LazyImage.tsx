import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export default function LazyImage({ src, alt, className, fallbackSrc, ...props }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  React.useEffect(() => {
    // Reset state when src changes
    setIsLoaded(false);
    setError(false);

    if (!src) {
      setError(true);
      setIsLoaded(true);
      return;
    }

    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => {
      setError(true);
      setIsLoaded(true);
    };

    // Fail-safe timeout
    const timer = setTimeout(() => {
      if (!isLoaded) {
        setError(true);
        setIsLoaded(true);
      }
    }, 6000);

    return () => {
      clearTimeout(timer);
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  // High-reliability fallbacks
  const placeholder = fallbackSrc || `https://images.unsplash.com/photo-1604654894610-df490c985507?auto=format&fit=crop&q=80&w=800`;

  return (
    <div className={`relative overflow-hidden bg-muted w-full h-full group/img ${className}`}>
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm z-20"
          >
            <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actual Image */}
      <motion.img
        src={error ? placeholder : src}
        alt={alt}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
        referrerPolicy="no-referrer"
        {...(props as any)}
      />

      {/* Fallback Overlay if error occurred (Text-based fallback) */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-muted/20 text-center z-10">
          <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/40 mb-2">Image unavailable</span>
          <p className="text-[8px] uppercase tracking-tighter text-muted-foreground/20 leading-tight line-clamp-2">{alt}</p>
        </div>
      )}
    </div>
  );
}

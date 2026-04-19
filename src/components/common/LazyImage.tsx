import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string; // Applied to container
  imgClassName?: string; // Applied to img tag
  fallbackSrc?: string;
}

export default function LazyImage({ 
  src, 
  alt, 
  className = '', 
  imgClassName = '', 
  fallbackSrc, 
  ...props 
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  // Define a chain of sources to try in order
  const sources = [
    src,
    fallbackSrc,
    `https://images.unsplash.com/photo-1604654894610-df490c985507?auto=format&fit=crop&q=60&w=800`, // Universal nail fallback
    `https://picsum.photos/seed/${alt.replace(/\s+/g, '-').toLowerCase()}/800/800`,
    `https://picsum.photos/seed/nails-placeholder/800/800`
  ].filter(Boolean) as string[];

  // Select the current source based on how many errors we've hit
  const currentSrc = errorCount < sources.length ? sources[errorCount] : '';

  // Reset if the primary src changes
  useEffect(() => {
    setLoaded(false);
    setErrorCount(0);
  }, [src]);

  // Safety timeout for each source attempt
  useEffect(() => {
    if (loaded || errorCount >= sources.length) return;

    const timer = setTimeout(() => {
      console.warn(`Image timed out: ${currentSrc}. Trying next.`);
      setErrorCount(prev => prev + 1);
    }, 8000); // 8 seconds per source

    return () => clearTimeout(timer);
  }, [currentSrc, loaded, errorCount, sources.length]);

  return (
    <div className={`relative overflow-hidden bg-muted w-full h-full group/img ${className}`}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

      <AnimatePresence>
        {!loaded && errorCount < sources.length && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-muted/30 backdrop-blur-[2px] z-20"
          >
            <div className="w-5 h-5 border-2 border-primary/10 border-t-primary rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {errorCount < sources.length ? (
        <motion.img
          key={currentSrc} // Key forces re-render/re-load on src change
          src={currentSrc}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setErrorCount(prev => prev + 1)}
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className={`absolute inset-0 w-full h-full object-cover z-10 ${imgClassName}`}
          referrerPolicy="no-referrer"
          {...(props as any)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-muted text-center z-10">
          <div className="w-10 h-[1px] bg-primary/20 mb-4" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/30 italic">
            Atelier Asset
          </span>
        </div>
      )}

      {/* Admin indicator if using fallback */}
      {errorCount > 0 && errorCount < sources.length && (
        <div className="absolute top-2 right-2 z-30 pointer-events-none">
          <span className="text-[6px] uppercase tracking-widest font-bold text-white bg-black/10 px-2 py-0.5 rounded-full backdrop-blur-sm">
            Optimized
          </span>
        </div>
      )}
    </div>
  );
}

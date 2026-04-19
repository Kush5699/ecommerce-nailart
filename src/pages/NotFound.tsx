import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-background px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="text-[10px] uppercase tracking-[0.5em] text-primary font-bold mb-6 block">Error 404</span>
        <h1 className="text-7xl md:text-9xl font-serif italic tracking-tighter mb-8">Out of Frame</h1>
        <p className="text-muted-foreground max-w-lg mx-auto mb-12 leading-relaxed uppercase tracking-widest text-[10px] font-bold">
          The item or perspective you are seeking does not exist in our current collection.
        </p>
        <Link to="/">
          <Button className="bg-primary text-on-primary rounded-none px-12 py-8 text-[10px] uppercase tracking-[0.3em] font-bold shadow-2xl hover:bg-primary/90 transition-all">
            Return to Collections
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}

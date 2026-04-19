import { motion } from 'motion/react';
import LazyImage from '@/src/components/common/LazyImage';

export default function Story() {
  return (
    <div className="overflow-hidden">
      {/* Editorial Header */}
      <section className="relative h-[80vh] flex items-center justify-center bg-muted/20">
        <div className="absolute inset-0 overflow-hidden">
          <LazyImage 
            src="https://images.unsplash.com/photo-1599948633231-163690680695?auto=format&fit=crop&q=80&w=1200" 
            alt="Atelier" 
            className="opacity-40 grayscale"
          />
        </div>
        <div className="relative z-10 text-center max-w-4xl px-6">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] uppercase tracking-[0.6em] text-primary font-bold mb-8 block"
          >
            The Atelier Philosophy
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-9xl font-serif italic tracking-tighter leading-none text-foreground mb-12"
          >
            Curating <br/>the <i className="font-normal">Ethereal</i>
          </motion.h1>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="w-32 h-[1px] bg-primary mx-auto"
          ></motion.div>
        </div>
      </section>

      {/* Narrative Section 1 */}
      <section className="py-40 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <h2 className="text-5xl font-serif leading-tight italic">Born from the <br/>Architectural Void.</h2>
            <div className="space-y-8 text-lg text-muted-foreground leading-relaxed max-w-lg">
              <p>
                Luxe Nail Art began not as a beauty brand, but as a study in form and light. Founded in Paris by a collective of architects and digital artists, we sought to bridge the gap between temporary adornment and permanent sculpture.
              </p>
              <p>
                We believe the hands are the most expressive tools of the human silhouette. They deserve more than mass-produced pigments; they deserve architectural precision and ethereal pigments that react to the world around them.
              </p>
            </div>
            <div className="pt-8 grid grid-cols-2 gap-12">
              <div>
                <span className="text-4xl font-serif italic text-primary">0%</span>
                <p className="text-[10px] uppercase tracking-widest font-bold mt-2 text-muted-foreground">Synthetic Fragrance</p>
              </div>
              <div>
                <span className="text-4xl font-serif italic text-primary">100%</span>
                <p className="text-[10px] uppercase tracking-widest font-bold mt-2 text-muted-foreground">Artisan Crafted</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[3/4] bg-muted overflow-hidden shadow-2xl">
              <LazyImage 
                src="https://images.unsplash.com/photo-1604654894610-df490c985507?auto=format&fit=crop&q=80&w=800" 
                alt="Process" 
              />
            </div>
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-primary-container p-10 flex flex-col justify-center shadow-xl">
              <p className="text-sm italic font-serif text-primary leading-relaxed">
                "We don't follow trends; we create the artifacts that define them."
              </p>
              <span className="text-[8px] uppercase tracking-widest font-bold mt-4 block">— The Collective</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="bg-muted/30 py-40">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            {[
              { title: 'Conscious Creation', text: 'Our gels are vegan, cruelty-free, and HEMA-free. We prioritize the health of your natural canvas as much as the art we place upon it.' },
              { title: 'Japanese Precision', text: 'We source our pigments and tools from the finest Japanese ateliers, ensuring a level of saturation and durability that is unmatched in the industry.' },
              { title: 'Sustainable Luxury', text: 'From our recycled glass flacons to our compostable shipping materials, every touchpoint is designed to leave a minimal footprint.' }
            ].map((value, i) => (
              <div key={i} className="space-y-8">
                <div className="w-12 h-[1px] bg-primary"></div>
                <h3 className="text-3xl font-serif italic">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 text-center max-w-4xl mx-auto px-6">
        <h2 className="text-5xl md:text-7xl font-serif italic mb-12">Join the Collective.</h2>
        <p className="text-xl text-muted-foreground mb-16 leading-relaxed">
          Experience the intersection of architecture and artistry. Discover our latest editorial drops and artisan insights.
        </p>
        <button className="bg-primary text-on-primary px-16 py-6 rounded-none text-[10px] uppercase tracking-[0.4em] font-bold shadow-2xl hover:bg-primary/90 transition-all active:scale-95">
          Explore the Collection
        </button>
      </section>
    </div>
  );
}

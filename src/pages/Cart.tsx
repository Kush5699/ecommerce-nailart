import { Link } from 'react-router-dom';
import { useCart } from '@/src/components/CartProvider';
import { motion } from 'motion/react';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LazyImage from '@/src/components/common/LazyImage';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, total } = useCart();

  if (cart.length === 0) {
    return (
      <div className="py-40 text-center max-w-screen-2xl mx-auto px-6">
        <h2 className="text-5xl font-serif mb-8 italic">Your collection is empty.</h2>
        <p className="text-muted-foreground mb-12 max-w-md mx-auto">Each piece is a testament to artisan craftsmanship, waiting to complete your silhouette.</p>
        <Link to="/collections/trending">
          <Button className="bg-primary text-on-primary rounded-none px-12 py-6 text-[10px] uppercase tracking-[0.3em] font-bold">
            Explore Collections
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-20">
      <header className="mb-20">
        <h1 className="text-5xl md:text-6xl font-serif tracking-tight text-foreground mb-4">Your Curated Collection</h1>
        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">Review your selections before they are prepared for delivery.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Cart Items */}
        <div className="lg:col-span-8 space-y-12">
          {cart.map((item) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col md:flex-row gap-8 items-start group border-b border-border/20 pb-12"
            >
              <div className="relative w-full md:w-56 h-72 overflow-hidden bg-muted">
                <LazyImage 
                  src={item.image} 
                  alt={item.name} 
                  className="transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between h-auto md:h-72 py-2">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-primary mb-2 block font-bold">{item.category}</span>
                      <h3 className="text-2xl font-serif leading-tight mb-2">{item.name}</h3>
                    </div>
                    <span className="text-xl font-serif">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <Badge className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border-none">Hand-painted</Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <div className="flex items-center gap-6 border-b border-border/40 pb-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="hover:text-primary transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity.toString().padStart(2, '0')}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="hover:text-primary transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors underline underline-offset-4"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary Panel */}
        <div className="lg:col-span-4 sticky top-32">
          <div className="bg-muted/30 p-8 lg:p-10 rounded-none shadow-sm">
            <h2 className="text-2xl font-serif mb-8 border-b border-border/40 pb-4 italic">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Artisan Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Taxes</span>
                <span className="font-medium">₹{(total * 0.08).toLocaleString('en-IN')}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-end border-t border-border/40 pt-6 mb-10">
              <span className="font-serif text-lg italic">Total</span>
              <div className="text-right">
                <span className="text-3xl font-serif text-primary">₹{(total * 1.08).toLocaleString('en-IN')}</span>
                <p className="text-[10px] text-muted-foreground uppercase mt-1 tracking-widest">INR</p>
              </div>
            </div>

            <Link to="/checkout">
              <Button className="w-full py-8 bg-primary text-on-primary rounded-none text-[10px] uppercase tracking-[0.3em] font-bold shadow-xl hover:bg-primary/90 transition-all group">
                Proceed to Checkout
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="mt-8 p-8 border border-border/20">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest mb-2">Sustainable Choice</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">Your order will be shipped in our signature recycled quartz-toned packaging, designed to be repurposed.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

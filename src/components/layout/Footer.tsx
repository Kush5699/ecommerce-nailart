import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-muted py-20 px-6 md:px-12 border-t border-border/20">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-24">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="text-xl font-serif italic text-primary mb-6 block">
            Luxe Nail Art
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            Curation for the conscious creator. Elevating the standard of DIY nail artistry through architectural precision and ethereal pigments.
          </p>
          <div className="flex gap-4 text-primary">
            <Instagram className="w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity" />
            <Twitter className="w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity" />
            <Facebook className="w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity" />
          </div>
        </div>

        <div>
          <h5 className="font-serif italic text-lg text-primary mb-6">Shop</h5>
          <ul className="space-y-4">
            <li><Link to="/collections/trending" className="text-sm text-muted-foreground hover:text-primary transition-colors">New Arrivals</Link></li>
            <li><Link to="/collections/press-ons" className="text-sm text-muted-foreground hover:text-primary transition-colors">Best Sellers</Link></li>
            <li><Link to="/collections/gels" className="text-sm text-muted-foreground hover:text-primary transition-colors">Artisan Gels</Link></li>
            <li><Link to="/collections/tools" className="text-sm text-muted-foreground hover:text-primary transition-colors">Precision Tools</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-serif italic text-lg text-primary mb-6">Services</h5>
          <ul className="space-y-4">
            <li><Link to="/story" className="text-sm text-muted-foreground hover:text-primary transition-colors">Our Story</Link></li>
            <li><Link to="/shipping" className="text-sm text-muted-foreground hover:text-primary transition-colors">Shipping & Returns</Link></li>
            <li><Link to="/sustainability" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sustainability</Link></li>
            <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-serif italic text-lg text-primary mb-6">The Collective</h5>
          <p className="text-sm text-muted-foreground mb-4">Join our inner circle for exclusive editorial drops and artisan insights.</p>
          <form className="flex border-b border-primary/30 pb-1">
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-transparent border-none p-0 text-sm w-full focus:ring-0 placeholder:text-muted-foreground/60"
            />
            <button type="submit" className="text-primary hover:translate-x-1 transition-transform">
              <Mail className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto mt-20 pt-8 border-t border-border/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          © 2024 Luxe Nail Art. All Rights Reserved.
        </span>
        <div className="flex gap-8">
          <Link to="/privacy" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
          <Link to="/terms" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">Terms</Link>
          <Link to="/cookies" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">Cookies</Link>
        </div>
      </div>
    </footer>
  );
}

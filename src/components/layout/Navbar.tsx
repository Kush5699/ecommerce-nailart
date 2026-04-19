import { Link } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu } from 'lucide-react';
import { useAuth } from '@/src/components/FirebaseProvider';
import { useCart } from '@/src/components/CartProvider';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const { user, isAdmin } = useAuth();
  const { cart } = useCart();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: 'Trending', href: '/collections/trending' },
    { name: 'Press-ons', href: '/collections/press-ons' },
    { name: 'Gels', href: '/collections/gels' },
    { name: 'Tools', href: '/collections/tools' },
    { name: 'Story', href: '/story' },
    ...(isAdmin ? [{ name: 'Admin', href: '/admin' }] : [])
  ];

  return (
    <nav className="sticky top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="flex justify-between items-center px-6 md:px-12 h-20 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-xl md:text-2xl font-serif italic tracking-tighter text-primary">
            Luxe Nail Art
          </Link>
          <div className="hidden lg:flex gap-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-xs uppercase tracking-widest font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:flex items-center relative">
            <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-accent/50 border-none rounded-full pl-10 pr-4 py-2 text-xs w-48 focus:ring-1 focus:ring-primary/20 placeholder:text-muted-foreground"
            />
          </div>
          
          <Link to="/cart" className="relative text-primary hover:opacity-70 transition-opacity active:scale-95">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] text-white font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          <Link to={user ? "/profile" : "/login"} className="text-primary hover:opacity-70 transition-opacity active:scale-95">
            <User className="w-5 h-5" />
          </Link>

          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="text-primary" />}>
                <Menu className="w-6 h-6" />
              </SheetTrigger>
              <SheetContent side="right" className="bg-background">
                <div className="flex flex-col gap-8 mt-12">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="text-lg font-serif italic text-primary"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

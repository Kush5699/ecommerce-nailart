import { motion } from 'motion/react';
import { Package, ChevronRight, Brush, Leaf, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { db, auth } from '@/src/lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';

export default function OrderHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="py-40 text-center">
        <p className="text-muted-foreground font-serif italic text-2xl">Retrieving your archive...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-40 text-center max-w-screen-2xl mx-auto px-6">
        <h2 className="text-5xl font-serif mb-8 italic">No orders found.</h2>
        <p className="text-muted-foreground mb-12 max-w-md mx-auto">Your journey with Luxe Nail Art begins with your first curation.</p>
        <Link to="/collections/trending">
          <Button className="bg-primary text-on-primary rounded-none px-12 py-6 text-[10px] uppercase tracking-[0.3em] font-bold">
            Start Your Collection
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-20">
      <header className="mb-20">
        <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold mb-4 block">Archive</span>
        <h1 className="text-5xl md:text-7xl font-serif italic tracking-tighter text-foreground mb-6">Order History</h1>
        <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
          Review your curated selections and past acquisitions. Each order reflects a moment of artisanal excellence.
        </p>
      </header>

      <div className="space-y-16">
        {orders.map((order) => (
          <motion.div 
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-muted/20 p-8 md:p-12 flex flex-col md:flex-row gap-12 items-start transition-all hover:bg-muted/30 duration-500 border border-border/10"
          >
            <div className="w-full md:w-1/3 aspect-[4/5] bg-muted relative overflow-hidden group">
              <img 
                src={order.items[0]?.image || "https://picsum.photos/seed/nails/800/1000"} 
                alt="Order Item" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-6 left-6">
                <Badge className="bg-secondary-container text-on-secondary-container rounded-full text-[9px] uppercase tracking-widest px-4 py-1.5 border-none">
                  {order.status}
                </Badge>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-between h-full space-y-10">
              <div>
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mb-2 block">Order Ref.</span>
                    <h3 className="text-3xl font-serif tracking-tight italic">#{order.id.slice(0, 8).toUpperCase()}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mb-2 block">Date</span>
                    <p className="text-sm font-medium">
                      {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Recent'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-6 mb-10">
                  {order.items.slice(0, 2).map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-primary-container rounded-none flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{item.name}</p>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Qty: {item.quantity} • {item.category}</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground italic">
                      + {order.items.length - 2} more items
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 pt-10 border-t border-border/20">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mb-2 block">Investment</span>
                  <p className="text-3xl font-serif text-primary italic">${order.total.toFixed(2)}</p>
                </div>
                <Button className="bg-primary text-on-primary rounded-none px-12 py-6 text-[10px] uppercase tracking-[0.3em] font-bold shadow-xl hover:bg-primary/90">
                  View Details
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

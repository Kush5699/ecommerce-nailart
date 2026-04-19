import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '@/src/lib/firebase';
import { collection, query, orderBy, onSnapshot, limit, addDoc, updateDoc, deleteDoc, doc, setDoc, getDocs, writeBatch } from 'firebase/firestore';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Package,
  ArrowUpRight,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Database
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/src/components/FirebaseProvider';
import { Navigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { products as initialProducts } from '@/src/data/products';
import LazyImage from '@/src/components/common/LazyImage';

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Product Form State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    category: 'press-ons',
    image: '',
    description: '',
    isNew: false,
    isLimited: false,
    tags: ''
  });

  useEffect(() => {
    if (!isAdmin) return;

    // Fetch recent orders
    const qOrders = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(10));
    const unsubscribeOrders = onSnapshot(qOrders, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch products
    const unsubscribeProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    // Fetch users count
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsersCount(snapshot.size);
    });

    return () => {
      unsubscribeOrders();
      unsubscribeProducts();
      unsubscribeUsers();
    };
  }, [isAdmin]);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleSeedDatabase = async () => {
    try {
      const batch = writeBatch(db);
      
      // Delete existing products first
      const snapshot = await getDocs(collection(db, 'products'));
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      initialProducts.forEach((p) => {
        const docRef = doc(db, 'products', p.id);
        const sanitizedProduct = JSON.parse(JSON.stringify(p));
        batch.set(docRef, sanitizedProduct);
      });
      await batch.commit();
      setFeedback({ type: 'success', message: 'Database wiped and seeded successfully' });
    } catch (error: any) {
      console.error('Seeding failed:', error);
      setFeedback({ type: 'error', message: `Seeding failed: ${error.message}` });
    }
  };

  const handleSaveProduct = async () => {
    try {
      const data = {
        ...productForm,
        price: Number(productForm.price),
        tags: productForm.tags.split(',').map(t => t.trim()).filter(t => t)
      };

      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), data);
        setFeedback({ type: 'success', message: 'Product updated successfully' });
      } else {
        const newDocRef = doc(collection(db, 'products'));
        await setDoc(newDocRef, {
          ...data,
          id: newDocRef.id
        });
        setFeedback({ type: 'success', message: 'Product added successfully' });
      }
      
      setIsAddingProduct(false);
      setEditingProduct(null);
      setProductForm({ name: '', price: 0, category: 'press-ons', image: '', description: '', isNew: false, isLimited: false, tags: '' });
    } catch (error: any) {
      console.error('Error saving product:', error);
      setFeedback({ type: 'error', message: `Save failed: ${error.message}` });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setFeedback({ type: 'success', message: 'Product deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting product:', error);
      setFeedback({ type: 'error', message: `Delete failed: ${error.message}` });
    }
  };

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-muted/10">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="font-serif italic text-xl text-muted-foreground">Authenticating Curator...</p>
      </div>
    </div>
  );

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/10 px-6">
        <div className="max-w-md w-full bg-background p-12 shadow-2xl border border-border/10 text-center space-y-8">
          <div className="w-16 h-16 bg-primary-container text-primary flex items-center justify-center mx-auto">
            <LayoutDashboard className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-serif italic">Access Restricted</h1>
            <p className="text-muted-foreground text-sm">
              This console is reserved for the Luxe Nail Art administrative collective.
            </p>
          </div>
          {!user ? (
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Please sign in to verify credentials</p>
              <Navigate to="/login" />
            </div>
          ) : (
            <div className="space-y-4 pt-4">
              <p className="text-[10px] uppercase tracking-widest font-bold text-destructive">Unauthorized Account</p>
              <p className="text-xs text-muted-foreground">Logged in as: {user.email}</p>
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full py-4 bg-primary text-on-primary text-[10px] uppercase tracking-widest font-bold shadow-lg hover:bg-primary/90 transition-all"
              >
                Return to Gallery
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);

  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-emerald-600' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-blue-600' },
    { label: 'Active Curators', value: usersCount, icon: Users, color: 'text-purple-600' },
    { label: 'Avg. Order Value', value: `₹${(totalRevenue / (orders.length || 1)).toLocaleString('en-IN')}`, icon: LayoutDashboard, color: 'text-amber-600' },
  ];

  return (
    <div className="min-h-screen bg-muted/10 pb-20">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-12">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold mb-4 block">Management Console</span>
            <h1 className="text-5xl md:text-6xl font-serif italic tracking-tighter text-foreground">Admin Dashboard</h1>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleSeedDatabase}
              className="flex items-center gap-2 px-6 py-3 bg-background border border-border/40 text-[10px] uppercase tracking-widest font-bold hover:bg-destructive hover:text-destructive-foreground transition-all"
              title="Wipe existing products and seed with defaults"
            >
              <Database className="w-4 h-4" />
              Wipe & Seed
            </button>
            <button 
              onClick={() => {
                setIsAddingProduct(true);
                setEditingProduct(null);
                setProductForm({ name: '', price: 0, category: 'press-ons', image: '', description: '', isNew: false, isLimited: false, tags: '' });
              }}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary text-[10px] uppercase tracking-widest font-bold shadow-lg hover:bg-primary/90 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </header>
        
        <AnimatePresence>
          {feedback && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-8 p-4 text-[10px] uppercase tracking-widest font-bold shadow-lg border ${
                feedback.type === 'success' 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                  : 'bg-destructive/10 border-destructive/20 text-destructive'
              }`}
            >
              {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-border/20 mb-12">
          {['overview', 'products', 'orders'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-4 text-[10px] uppercase tracking-[0.3em] font-bold transition-all relative ${
                activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {stats.map((stat, i) => (
                  <div 
                    key={i}
                    className="bg-background p-8 border border-border/10 shadow-sm group hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className={`p-3 bg-muted/30 rounded-none ${stat.color}`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">{stat.label}</p>
                    <p className="text-3xl font-serif italic">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Recent Orders Table (Simplified for Overview) */}
                <div className="lg:col-span-8 space-y-8">
                  <h2 className="text-2xl font-serif italic">Recent Acquisitions</h2>
                  <div className="bg-background border border-border/10 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-muted/30 border-b border-border/10">
                          <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Order ID</th>
                          <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Status</th>
                          <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/10">
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order.id} className="hover:bg-muted/5 transition-colors">
                            <td className="px-8 py-6 font-mono text-xs text-muted-foreground">#{order.id.slice(0, 8).toUpperCase()}</td>
                            <td className="px-8 py-6">
                              <Badge variant="outline" className="rounded-none text-[8px] uppercase tracking-widest px-2 py-0.5 border-primary/20 text-primary">
                                {order.status}
                              </Badge>
                            </td>
                            <td className="px-8 py-6 font-serif italic">₹{(order.total || 0).toLocaleString('en-IN')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Activity Feed */}
                <div className="lg:col-span-4 space-y-8">
                  <h2 className="text-2xl font-serif italic">System Activity</h2>
                  <div className="bg-background border border-border/10 shadow-sm p-8 space-y-8">
                    {[
                      { icon: Clock, text: 'New order received from Julianne', time: '2 mins ago' },
                      { icon: CheckCircle2, text: 'Inventory updated: Midnight Flora', time: '1 hour ago' },
                    ].map((activity, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <div className="p-2 bg-muted/30 text-primary">
                          <activity.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm leading-tight mb-1">{activity.text}</p>
                          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{activity.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div 
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                  <div key={product.id} className="bg-background border border-border/10 group overflow-hidden">
                    <div className="aspect-[4/5] relative overflow-hidden bg-muted">
                      <LazyImage 
                        src={product.image} 
                        alt={product.name} 
                        className="transition-transform group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button 
                          onClick={() => {
                            setEditingProduct(product);
                            setProductForm({
                              name: product.name,
                              price: product.price,
                              category: product.category,
                              image: product.image,
                              description: product.description || '',
                              isNew: product.isNew || false,
                              isLimited: product.isLimited || false,
                              tags: (product.tags || []).join(', ')
                            });
                            setIsAddingProduct(true);
                          }}
                          className="p-3 bg-background text-primary rounded-full hover:scale-110 transition-transform"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-3 bg-background text-destructive rounded-full hover:scale-110 transition-transform"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif italic text-lg mb-1">{product.name}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{product.category}</span>
                        <span className="font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div 
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-background border border-border/10 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border/10">
                      <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Order ID</th>
                      <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Customer</th>
                      <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Status</th>
                      <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Amount</th>
                      <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/10">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-muted/5 transition-colors">
                        <td className="px-8 py-6 font-mono text-xs text-muted-foreground">#{order.id.slice(0, 8).toUpperCase()}</td>
                        <td className="px-8 py-6 text-sm">{order.userId === 'anonymous' ? 'Guest' : 'Curator'}</td>
                        <td className="px-8 py-6">
                          <select 
                            value={order.status}
                            onChange={async (e) => {
                              await updateDoc(doc(db, 'orders', order.id), { status: e.target.value });
                            }}
                            className="bg-transparent border border-border/20 text-[10px] uppercase tracking-widest font-bold px-2 py-1 focus:ring-1 focus:ring-primary"
                          >
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>
                        <td className="px-8 py-6 font-serif italic">₹{(order.total || 0).toLocaleString('en-IN')}</td>
                        <td className="px-8 py-6 text-xs text-muted-foreground">
                          {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Recent'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Modal */}
        {isAddingProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsAddingProduct(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative w-full max-w-2xl bg-background border border-border/10 shadow-2xl p-12 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-start mb-12">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold mb-4 block">Inventory Management</span>
                  <h2 className="text-4xl font-serif italic">{editingProduct ? 'Edit Masterpiece' : 'Add New Creation'}</h2>
                </div>
                <button onClick={() => setIsAddingProduct(false)} className="p-2 hover:bg-muted/30 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Product Name</label>
                    <Input 
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      className="border-none border-b border-border/40 rounded-none bg-transparent px-0 py-4 focus-visible:ring-0 focus-visible:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Price (₹)</label>
                    <Input 
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: Number(e.target.value)})}
                      className="border-none border-b border-border/40 rounded-none bg-transparent px-0 py-4 focus-visible:ring-0 focus-visible:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Category</label>
                    <select 
                      value={productForm.category}
                      onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                      className="w-full border-none border-b border-border/40 rounded-none bg-transparent px-0 py-4 focus:ring-0 focus:border-primary transition-all text-sm"
                    >
                      <option value="press-ons">Press-ons</option>
                      <option value="gels">Gels</option>
                      <option value="tools">Tools</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Image URL</label>
                    <Input 
                      value={productForm.image}
                      onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                      placeholder="https://images.unsplash.com/..."
                      className="border-none border-b border-border/40 rounded-none bg-transparent px-0 py-4 focus-visible:ring-0 focus-visible:border-primary transition-all"
                    />
                  </div>
                  {/* Image Preview */}
                  {productForm.image && (
                    <div className="aspect-[4/5] bg-muted overflow-hidden border border-border/10 relative">
                      <LazyImage src={productForm.image} alt="Preview" />
                      <div className="absolute top-2 right-2">
                        <Badge variant="outline" className="bg-background/80 backdrop-blur-sm text-[8px] uppercase font-bold px-2 py-0.5 border-none">Preview</Badge>
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Tags (comma separated)</label>
                    <Input 
                      value={productForm.tags}
                      onChange={(e) => setProductForm({...productForm, tags: e.target.value})}
                      placeholder="Hand-painted, Matte, Chrome"
                      className="border-none border-b border-border/40 rounded-none bg-transparent px-0 py-4 focus-visible:ring-0 focus-visible:border-primary transition-all"
                    />
                  </div>
                  <div className="flex gap-8 pt-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={productForm.isNew}
                        onChange={(e) => setProductForm({...productForm, isNew: e.target.checked})}
                        className="w-4 h-4 rounded-none border-border/40 text-primary focus:ring-primary"
                      />
                      <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground group-hover:text-primary transition-colors">New Arrival</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={productForm.isLimited}
                        onChange={(e) => setProductForm({...productForm, isLimited: e.target.checked})}
                        className="w-4 h-4 rounded-none border-border/40 text-primary focus:ring-primary"
                      />
                      <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground group-hover:text-primary transition-colors">Limited Edition</span>
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Description</label>
                  <textarea 
                    value={productForm.description}
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    rows={3}
                    className="w-full border-none border-b border-border/40 rounded-none bg-transparent px-0 py-4 focus:ring-0 focus:border-primary transition-all text-sm resize-none"
                  />
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                <Button 
                  onClick={handleSaveProduct}
                  className="flex-1 py-8 bg-primary text-on-primary rounded-none text-[10px] uppercase tracking-[0.3em] font-bold shadow-xl hover:bg-primary/90 transition-all"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingProduct ? 'Update Masterpiece' : 'Publish Creation'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsAddingProduct(false)}
                  className="px-8 py-8 border-border/40 rounded-none text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-muted/30 transition-all"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { FirebaseProvider } from '@/src/components/FirebaseProvider';
import { CartProvider } from '@/src/components/CartProvider';
import ErrorBoundary from '@/src/components/ErrorBoundary';
import Navbar from '@/src/components/layout/Navbar';
import Footer from '@/src/components/layout/Footer';

// Lazy load pages for performance
const Home = lazy(() => import('@/src/pages/Home'));
const Collections = lazy(() => import('@/src/pages/Collections'));
const ProductDetail = lazy(() => import('@/src/pages/ProductDetail'));
const Cart = lazy(() => import('@/src/pages/Cart'));
const Checkout = lazy(() => import('@/src/pages/Checkout'));
const Profile = lazy(() => import('@/src/pages/Profile'));
const OrderHistory = lazy(() => import('@/src/pages/OrderHistory'));
const Story = lazy(() => import('@/src/pages/Story'));
const Login = lazy(() => import('@/src/pages/Login'));
const AdminDashboard = lazy(() => import('@/src/pages/AdminDashboard'));
const NotFound = lazy(() => import('@/src/pages/NotFound'));
const Privacy = lazy(() => import('@/src/pages/Privacy'));
const Terms = lazy(() => import('@/src/pages/Terms'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground font-bold">Refining Perspective...</span>
  </div>
);

export default function App() {
  return (
    <ErrorBoundary>
      <FirebaseProvider>
        <CartProvider>
          <Router>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/collections/:category" element={<Collections />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/orders" element={<OrderHistory />} />
                    <Route path="/story" element={<Story />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </FirebaseProvider>
    </ErrorBoundary>
  );
}

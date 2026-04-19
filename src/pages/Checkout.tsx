import { useCart } from '@/src/components/CartProvider';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, CreditCard, Wallet, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth as firebaseAuth } from '@/src/lib/firebase';
import { collection, doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { useAuth } from '@/src/components/FirebaseProvider';
import GooglePayButton from '@google-pay/button-react';

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData(prev => ({
            ...prev,
            firstName: data.displayName?.split(' ')[0] || '',
            lastName: data.displayName?.split(' ').slice(1).join(' ') || '',
            address: data.shippingAddress || '',
          }));
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    
    setPaymentStatus('processing');
    setIsSubmitting(true);

    // Simulate Payment Processing
    await new Promise(resolve => setTimeout(resolve, 2500));

    try {
      const orderRef = doc(collection(db, 'orders'));
      const orderData = {
        orderId: orderRef.id,
        userId: firebaseAuth.currentUser?.uid || 'anonymous',
        items: cart,
        total: total * 1.08, // Including 8% tax
        status: 'processing',
        shippingInfo: {
          name: `${formData.firstName} ${formData.lastName}`,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode
        },
        createdAt: serverTimestamp(),
      };

      await setDoc(orderRef, orderData);
      setPaymentStatus('success');
      
      setTimeout(() => {
        clearCart();
        navigate('/orders');
      }, 2000);
    } catch (error) {
      console.error('Error placing order:', error);
      setPaymentStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8"
        >
          <div className="w-24 h-24 bg-primary-container text-primary flex items-center justify-center rounded-full mx-auto shadow-2xl">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-serif italic">Acquisition Confirmed</h1>
            <p className="text-muted-foreground">Your curation is being prepared for transit.</p>
          </div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-primary animate-pulse">Redirecting to your collection...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Checkout Form */}
        <div className="lg:col-span-7 space-y-16">
          <section>
            <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold mb-4 block">Final Stage</span>
            <h1 className="text-6xl font-serif italic tracking-tighter">Checkout</h1>
          </section>

          {/* Shipping Information */}
          <section className="space-y-10">
            <div className="flex items-center gap-4">
              <span className="w-10 h-10 rounded-none bg-primary text-on-primary flex items-center justify-center font-serif text-lg">01</span>
              <h2 className="text-2xl font-serif italic">Shipping Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">First Name</label>
                <Input 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="border-none border-b border-border/40 rounded-none bg-transparent px-0 py-6 focus-visible:ring-0 focus-visible:border-primary transition-all" 
                  placeholder="Julianne" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Last Name</label>
                <Input 
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="border-none border-b border-border/40 rounded-none bg-transparent px-0 py-6 focus-visible:ring-0 focus-visible:border-primary transition-all" 
                  placeholder="Moore" 
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Address</label>
                <Input 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="border-none border-b border-border/40 rounded-none bg-transparent px-0 py-6 focus-visible:ring-0 focus-visible:border-primary transition-all" 
                  placeholder="742 Evergreen Terrace" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">City</label>
                <Input 
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="border-none border-b border-border/40 rounded-none bg-transparent px-0 py-6 focus-visible:ring-0 focus-visible:border-primary transition-all" 
                  placeholder="Springfield" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Postal Code</label>
                <Input 
                  value={formData.postalCode}
                  onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                  className="border-none border-b border-border/40 rounded-none bg-transparent px-0 py-6 focus-visible:ring-0 focus-visible:border-primary transition-all" 
                  placeholder="62704" 
                />
              </div>
            </div>
          </section>

          {/* Payment Details */}
          <section className="space-y-10">
            <div className="flex items-center gap-4">
              <span className="w-10 h-10 rounded-none bg-primary text-on-primary flex items-center justify-center font-serif text-lg">02</span>
              <h2 className="text-2xl font-serif italic">Payment Details</h2>
            </div>
            <div className="p-12 bg-muted/20 border border-border/5 space-y-10 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-4 text-muted-foreground">
                  <CreditCard className="w-6 h-6" />
                  <Wallet className="w-6 h-6" />
                </div>
                <span className="text-[8px] uppercase tracking-widest font-bold text-muted-foreground px-3 py-1 border border-border/20">Encrypted</span>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Card Number</label>
                <Input 
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                  className="border-none border-b border-border/40 rounded-none bg-transparent px-0 py-6 focus-visible:ring-0 focus-visible:border-primary transition-all font-mono tracking-widest" 
                  placeholder="0000 0000 0000 0000" 
                />
              </div>
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Expiry Date</label>
                  <Input 
                    value={formData.expiry}
                    onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                    className="border-none border-b border-border/40 rounded-none bg-transparent px-0 py-6 focus-visible:ring-0 focus-visible:border-primary transition-all" 
                    placeholder="MM/YY" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">CVV</label>
                  <Input 
                    value={formData.cvv}
                    onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                    className="border-none border-b border-border/40 rounded-none bg-transparent px-0 py-6 focus-visible:ring-0 focus-visible:border-primary transition-all" 
                    placeholder="***" 
                    type="password" 
                  />
                </div>
              </div>
            </div>
            
            <AnimatePresence>
              {paymentStatus === 'error' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 p-4 bg-destructive/10 text-destructive text-xs font-bold uppercase tracking-widest"
                >
                  <AlertCircle className="w-4 h-4" />
                  Transaction declined. Please verify your credentials.
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-3 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              <Lock className="w-3 h-3 text-primary" />
              Secured by LuxeVault™ 256-bit Encryption
            </div>
          </section>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5 lg:sticky lg:top-32">
          <div className="bg-background p-12 shadow-2xl border border-border/10 space-y-12">
            <h2 className="text-4xl font-serif italic tracking-tight">Order Summary</h2>
            
            <div className="space-y-8 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-6 items-center">
                  <div className="w-24 h-24 bg-muted overflow-hidden shadow-sm">
                    <img src={item.image} alt={item.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-serif text-lg leading-tight">{item.name}</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{item.category}</p>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[10px] font-bold text-muted-foreground">QTY: {item.quantity}</span>
                      <span className="font-serif text-lg">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-12 border-t border-border/20">
              <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-primary italic">Complimentary</span>
              </div>
              <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                <span className="text-muted-foreground">Taxes (8%)</span>
                <span className="text-foreground">₹{(total * 0.08).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-3xl font-serif pt-8 border-t border-border/40 italic">
                <span>Total</span>
                <span className="text-primary">₹{(total * 1.08).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                <Button 
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full bg-primary text-on-primary py-10 rounded-none text-[10px] uppercase tracking-[0.4em] font-bold shadow-2xl hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                      Authorizing...
                    </div>
                  ) : 'Complete Acquisition'}
                </Button>

                <div className="flex items-center gap-4 py-2">
                  <div className="h-[1px] flex-grow bg-border/30"></div>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground">Or Pay With</span>
                  <div className="h-[1px] flex-grow bg-border/30"></div>
                </div>

                <div className="w-full flex justify-center">
                  <GooglePayButton
                    environment="TEST"
                    buttonColor="black"
                    buttonType="buy"
                    buttonSizeMode="fill"
                    paymentRequest={{
                      apiVersion: 2,
                      apiVersionMinor: 0,
                      allowedPaymentMethods: [
                        {
                          type: 'CARD',
                          parameters: {
                            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                            allowedCardNetworks: ['AMEX', 'DISCOVER', 'INTERAC', 'JCB', 'MASTERCARD', 'VISA'],
                          },
                          tokenizationSpecification: {
                            type: 'PAYMENT_GATEWAY',
                            parameters: {
                              gateway: 'example',
                              gatewayMerchantId: 'exampleGatewayMerchantId',
                            },
                          },
                        },
                      ],
                      merchantInfo: {
                        merchantId: '12345678901234567890',
                        merchantName: 'Luxe Nail Art',
                      },
                      transactionInfo: {
                        totalPriceStatus: 'FINAL',
                        totalPriceLabel: 'Total',
                        totalPrice: (total * 1.08).toFixed(0),
                        currencyCode: 'INR',
                        countryCode: 'IN',
                      },
                    }}
                    onLoadPaymentData={paymentRequest => {
                      console.log('load payment data', paymentRequest);
                      handlePlaceOrder();
                    }}
                    style={{ width: '100%', height: '60px' }}
                  />
                </div>
              </div>
              <p className="text-[9px] text-center text-muted-foreground leading-relaxed uppercase tracking-widest font-bold px-4">
                By finalizing this acquisition, you agree to our <a href="#" className="underline text-primary">Terms of Curation</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

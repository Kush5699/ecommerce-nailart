import { useAuth } from '@/src/components/FirebaseProvider';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, Heart, MapPin, Package, LogOut, ChevronRight, Save, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { auth, db } from '@/src/lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { handleFirestoreError, OperationType } from '@/src/lib/firestore-errors';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: ''
  });
  
  const [addressData, setAddressData] = useState({
    street: '',
    city: '',
    postalCode: '',
    country: ''
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setProfileData({
              displayName: data.displayName || user.displayName || '',
              email: data.email || user.email || ''
            });
            if (data.address) {
              setAddressData(data.address);
            }
          } else {
            // Initialize with auth data if doc doesn't exist
            setProfileData({
              displayName: user.displayName || '',
              email: user.email || ''
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    const path = `users/${user.uid}`;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: profileData.displayName
      });
      setIsEditingProfile(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const handleUpdateAddress = async () => {
    if (!user) return;
    const path = `users/${user.uid}`;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        address: addressData
      });
      setIsEditingAddress(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  if (!user) {
    return (
      <div className="py-40 text-center">
        <h2 className="text-3xl font-serif mb-4 italic">Please sign in to view your profile.</h2>
        <Link to="/login" className="text-primary underline">Sign In</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-40 text-center">
        <p className="text-muted-foreground font-serif italic text-2xl">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-20">
      <header className="mb-16">
        <h1 className="text-5xl md:text-6xl font-serif italic tracking-tight text-primary mb-2">Bonjour, {profileData.displayName || 'Elena'}</h1>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold">Member since October 2023</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-3 space-y-2">
          <nav className="flex flex-col gap-1">
            {[
              { name: 'Orders', icon: Package, href: '/orders' },
              { name: 'Favorites', icon: Heart, href: '#' },
              { name: 'Address Book', icon: MapPin, href: '#' },
              { name: 'Settings', icon: Settings, href: '#' },
            ].map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="group flex items-center justify-between p-6 bg-muted/20 hover:bg-primary-container/30 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <item.icon className="w-4 h-4 text-primary" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">{item.name}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
            <button 
              onClick={handleSignOut}
              className="mt-12 group flex items-center gap-4 p-6 text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Sign Out</span>
            </button>
          </nav>
        </div>

        {/* Main Profile Content */}
        <div className="lg:col-span-9 space-y-16">
          {/* Loyalty Program */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative overflow-hidden p-12 bg-primary-container text-primary flex flex-col justify-between min-h-[350px]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] mb-6 block font-bold">Loyalty Status</span>
                <h2 className="text-4xl font-serif italic mb-2">Artisan Points</h2>
              </div>
              <div className="z-10">
                <div className="text-7xl font-serif mb-6">2,450</div>
                <div className="flex items-center gap-6">
                  <Button className="bg-primary text-on-primary rounded-none px-8 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-primary/90">Redeem Now</Button>
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-80 underline decoration-1 underline-offset-8 cursor-pointer">History</span>
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-secondary-container rounded-full opacity-30 blur-3xl"></div>
            </div>

            <div className="p-12 bg-background border border-border/20 flex flex-col justify-between min-h-[350px]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] mb-6 block font-bold text-primary">Next Milestone</span>
                <h3 className="text-2xl font-serif italic text-foreground">550 points until 'Master Curator'</h3>
              </div>
              <div className="space-y-6">
                <div className="w-full h-[2px] bg-muted">
                  <div className="bg-primary h-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">Unlock exclusive early access to Limited Collections and complimentary luxury shipping on all orders.</p>
              </div>
            </div>
          </section>

          {/* Personal Info */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-12 border-t border-border/20">
            <div className="space-y-10">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-serif text-primary italic">Profile Information</h3>
                {isEditingProfile ? (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setIsEditingProfile(false)}><X className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={handleUpdateProfile}><Save className="w-4 h-4 text-primary" /></Button>
                  </div>
                ) : (
                  <Button variant="link" onClick={() => setIsEditingProfile(true)} className="p-0 h-auto text-primary text-[10px] uppercase tracking-widest font-bold underline-offset-8">Edit Details</Button>
                )}
              </div>
              
              <div className="space-y-8">
                <div className="border-b border-border/20 pb-4">
                  <label className="block text-[9px] uppercase tracking-widest text-muted-foreground font-bold mb-2">Full Name</label>
                  {isEditingProfile ? (
                    <Input 
                      value={profileData.displayName} 
                      onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                      className="border-none bg-accent/30 rounded-none h-8 text-sm"
                    />
                  ) : (
                    <p className="text-sm font-bold">{profileData.displayName || 'Elena Rousseau'}</p>
                  )}
                </div>
                <div className="border-b border-border/20 pb-4">
                  <label className="block text-[9px] uppercase tracking-widest text-muted-foreground font-bold mb-2">Email Address</label>
                  <p className="text-sm font-bold text-muted-foreground">{profileData.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-serif text-primary italic">Shipping Address</h3>
                {isEditingAddress ? (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setIsEditingAddress(false)}><X className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={handleUpdateAddress}><Save className="w-4 h-4 text-primary" /></Button>
                  </div>
                ) : (
                  <Button variant="link" onClick={() => setIsEditingAddress(true)} className="p-0 h-auto text-primary text-[10px] uppercase tracking-widest font-bold underline-offset-8">Modify Address</Button>
                )}
              </div>
              
              <div className="p-10 bg-muted/20 relative group border border-border/10">
                {isEditingAddress ? (
                  <div className="space-y-4">
                    <Input 
                      placeholder="Street Address"
                      value={addressData.street}
                      onChange={(e) => setAddressData({...addressData, street: e.target.value})}
                      className="border-none bg-background rounded-none text-xs"
                    />
                    <Input 
                      placeholder="City"
                      value={addressData.city}
                      onChange={(e) => setAddressData({...addressData, city: e.target.value})}
                      className="border-none bg-background rounded-none text-xs"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input 
                        placeholder="Postal Code"
                        value={addressData.postalCode}
                        onChange={(e) => setAddressData({...addressData, postalCode: e.target.value})}
                        className="border-none bg-background rounded-none text-xs"
                      />
                      <Input 
                        placeholder="Country"
                        value={addressData.country}
                        onChange={(e) => setAddressData({...addressData, country: e.target.value})}
                        className="border-none bg-background rounded-none text-xs"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed font-medium">
                    {addressData.street || '42 Rue de Rivoli'}<br/>
                    {addressData.city || '75004 Paris'}<br/>
                    {addressData.country || 'France'}
                    {addressData.postalCode && ` (${addressData.postalCode})`}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

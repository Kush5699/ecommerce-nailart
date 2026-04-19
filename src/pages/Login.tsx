import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '@/src/lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user document exists, if not create it
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: 'user',
          points: 0,
          createdAt: new Date().toISOString()
        });
      }

      navigate('/profile');
    } catch (error: any) {
      console.error('Login failed:', error);
      if (error.code === 'auth/network-request-failed') {
        alert('Network error: Please check your internet connection and ensure no ad-blockers or VPNs are blocking Firebase.');
      } else {
        alert(`Login failed: ${error.message}`);
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-20 bg-muted/10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-background p-12 shadow-2xl border border-border/10"
      >
        <header className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold mb-4 block">Welcome Back</span>
          <h1 className="text-4xl font-serif italic tracking-tight">Sign In</h1>
        </header>

        <div className="space-y-8">
          <div className="space-y-6">
            <div className="relative group">
              <Mail className="absolute left-0 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-none border-b border-border/40 rounded-none bg-transparent pl-8 pr-0 py-6 focus-visible:ring-0 focus-visible:border-primary transition-all placeholder:text-muted-foreground/60"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-0 top-3 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-none border-b border-border/40 rounded-none bg-transparent pl-8 pr-0 py-6 focus-visible:ring-0 focus-visible:border-primary transition-all placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
            <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-primary transition-colors">
              <input type="checkbox" className="rounded-none border-border/40 text-primary focus:ring-primary" />
              Remember Me
            </label>
            <Link to="#" className="text-primary hover:opacity-70 transition-opacity">Forgot Password?</Link>
          </div>

          <Button className="w-full py-8 bg-primary text-on-primary rounded-none text-[10px] uppercase tracking-[0.3em] font-bold shadow-xl hover:bg-primary/90 transition-all group">
            Sign In
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/20"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
              <span className="bg-background px-4 text-muted-foreground/60">Or continue with</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={handleGoogleLogin}
            className="w-full py-8 border-border/40 rounded-none text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-muted/30 transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </Button>

          <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold pt-4">
            New to the Collective? <Link to="#" className="text-primary underline underline-offset-8">Create Account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

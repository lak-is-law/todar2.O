'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import styles from './Login.module.css';

import Script from 'next/script';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        const res = await signIn('credentials', {
          redirect: false,
          email,
          password
        });
        
        if (res?.error) {
          throw new Error('Invalid credentials');
        }
        
        if (res?.ok) {
          router.push('/');
        }
      } else {
        // Handle signup
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || 'Signup failed');
        }

        // Auto login after signup
        const loginRes = await signIn('credentials', {
          redirect: false,
          email,
          password
        });

        if (loginRes?.ok) {
          router.push('/');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      {/* Background Architectural Elements */}
      <div className={styles.bgGeometry}>
        <div className={styles.bgArch} />
      </div>

      <GlassCard elevation="high" className={styles.authCard}>
        <div className={styles.brand}>
          <div className={styles.logoArch}></div>
          <span className={styles.logoText}>TODAR</span>
        </div>

        <div className={styles.header}>
          <h2>{isLogin ? 'Welcome back.' : 'Create Account'}</h2>
          <p>
            {isLogin 
              ? 'Take control of your finances.' 
              : 'Sign up to start tracking your expenses.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorAlert}>{error}</div>}

          {!isLogin && (
            <div className={styles.inputGroup}>
              <label htmlFor="name">Full Name</label>
              <input 
                id="name" 
                type="text" 
                placeholder="Enter your full name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input 
              id="email" 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              type="password" 
              placeholder={isLogin ? 'Enter your password' : 'Create a password'} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          {!isLogin && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-md)' }}>
              <input 
                type="checkbox" 
                id="terms" 
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                style={{ accentColor: 'var(--primary)' }}
              />
              <label htmlFor="terms" style={{ fontSize: '0.9rem', color: 'var(--text-muted-color)' }}>
                I agree to the <Link href="/terms" style={{ color: 'var(--primary)', textDecoration: 'none' }} target="_blank">Terms and Conditions</Link>
              </label>
            </div>
          )}

          <PremiumButton 
            type="submit" 
            size="lg" 
            className={styles.submitButton}
            disabled={isLoading || (!isLogin && !termsAccepted)}
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </PremiumButton>
        </form>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-xl)' }}>
          <PremiumButton 
            type="button" 
            variant="secondary" 
            onClick={handleGoogleSignIn}
            style={{ width: '100%' }}
          >
            Sign in with Google
          </PremiumButton>
        </div>

        <div className={styles.footer}>
          <button 
            type="button" 
            className={styles.toggleButton}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </GlassCard>
    </div>
  );
}

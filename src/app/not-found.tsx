'use client';

import React from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Home } from 'lucide-react';
import { PageTransition } from '@/components/motion/PageTransition';
import { Reveal } from '@/components/motion/Reveal';

export default function NotFound() {
  return (
    <PageTransition>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        padding: 'var(--space-md)'
      }}>
        <Reveal>
          <GlassCard elevation="high" style={{
            maxWidth: '500px',
            textAlign: 'center',
            padding: 'var(--space-4xl) var(--space-2xl)'
          }}>
            <h1 style={{ 
              fontSize: '6rem', 
              fontFamily: 'var(--font-display)', 
              color: 'var(--primary)',
              margin: '0 0 var(--space-md) 0',
              lineHeight: 1
            }}>404</h1>
            <h2 style={{
              margin: '0 0 var(--space-sm) 0',
              color: 'var(--text)'
            }}>Page Not Found</h2>
            <p style={{
              color: 'var(--text-muted-color)',
              marginBottom: 'var(--space-xl)',
              fontSize: '1.1rem'
            }}>
              The financial intelligence you are looking for does not exist or has been moved.
            </p>
            
            <Link href="/" style={{ textDecoration: 'none' }}>
              <PremiumButton icon={<Home size={18} />}>
                Return to Dashboard
              </PremiumButton>
            </Link>
          </GlassCard>
        </Reveal>
      </div>
    </PageTransition>
  );
}

'use client';

import React, { useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { PageTransition } from '@/components/motion/PageTransition';
import { Reveal } from '@/components/motion/Reveal';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Caught by Error Boundary:', error);
  }, [error]);

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
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 'var(--space-xl)',
              color: '#EF4444'
            }}>
              <AlertTriangle size={64} strokeWidth={1.5} />
            </div>
            
            <h2 style={{
              margin: '0 0 var(--space-md) 0',
              color: 'var(--text)',
              fontFamily: 'var(--font-display)',
              fontSize: '2rem'
            }}>Unexpected Error</h2>
            
            <p style={{
              color: 'var(--text-muted-color)',
              marginBottom: 'var(--space-2xl)',
              fontSize: '1.1rem',
              lineHeight: 1.5
            }}>
              We couldn't load this financial data. Please try again or navigate back to safety.
            </p>
            
            <PremiumButton 
              onClick={() => reset()} 
              icon={<RefreshCw size={18} />}
            >
              Retry
            </PremiumButton>
          </GlassCard>
        </Reveal>
      </div>
    </PageTransition>
  );
}

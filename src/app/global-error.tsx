'use client';

import React, { useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { PageTransition } from '@/components/motion/PageTransition';
import { Reveal } from '@/components/motion/Reveal';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <PageTransition>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100dvh',
            padding: 'var(--space-md)',
            backgroundColor: 'var(--background)'
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
                  color: '#EF4444' // Red warning color
                }}>
                  <AlertTriangle size={64} strokeWidth={1.5} />
                </div>
                
                <h2 style={{
                  margin: '0 0 var(--space-md) 0',
                  color: 'var(--text)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem'
                }}>System Error</h2>
                
                <p style={{
                  color: 'var(--text-muted-color)',
                  marginBottom: 'var(--space-2xl)',
                  fontSize: '1.1rem',
                  lineHeight: 1.5
                }}>
                  An unexpected error occurred while processing your request. Please try again or contact support if the issue persists.
                </p>
                
                <PremiumButton 
                  onClick={() => reset()} 
                  icon={<RefreshCw size={18} />}
                >
                  Attempt Recovery
                </PremiumButton>
              </GlassCard>
            </Reveal>
          </div>
        </PageTransition>
      </body>
    </html>
  );
}

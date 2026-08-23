'use client';

import React, { useEffect, useState } from 'react';
import { PageTransition } from '@/components/motion/PageTransition';
import { Reveal } from '@/components/motion/Reveal';
import { GlassCard } from '@/components/ui/GlassCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { RefreshCw, Lightbulb, AlertTriangle, TrendingUp, BrainCircuit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function InsightsPage() {
  const router = useRouter();
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('last30');

  const { status } = useSession();

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      if (status !== 'authenticated') return;

      try {
        const res = await fetch(`/api/insights?range=${range}`);
        
        if (res.status === 401) {
          router.push('/login');
          return;
        }

        if (res.ok) {
          const data = await res.json();
          setInsights(data);
        }
      } catch (err) {
        console.error('Failed to fetch insights', err);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchInsights();
    }
  }, [range, status, router]);

  return (
    <PageTransition>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2xl)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <Reveal width="100%">
          <h1 style={{ marginBottom: 'var(--space-xs)' }}>AI Insights</h1>
          <p style={{ color: 'var(--text-muted-color)', margin: 0 }}>Discover intelligent patterns in your spending.</p>
        </Reveal>
        
        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
          <select 
            value={range} 
            onChange={(e) => setRange(e.target.value)}
            style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              color: 'var(--text)', 
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              borderRadius: 'var(--radius-sm)',
              padding: '0 var(--space-md)',
              fontFamily: 'var(--font-sans)',
              outline: 'none'
            }}
          >
            <option value="last30">Last 30 Days</option>
            <option value="last90">Last 90 Days</option>
            <option value="ytd">Year to Date</option>
          </select>
          <PremiumButton variant="secondary" icon={<RefreshCw size={18} />} disabled={loading}>
            Refresh
          </PremiumButton>
        </div>
      </div>

      <Reveal delay={0.1}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-4xl) 0' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-xl)' }}>
            
            <GlassCard elevation="medium">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
                <BrainCircuit size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>Predictions</h3>
              </div>
              <div>
                <p style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text)', margin: '0 0 var(--space-xs) 0' }}>
                  ₹{insights?.predictions?.nextMonth?.toLocaleString('en-IN') || '0'}
                </p>
                <p style={{ color: 'var(--text-muted-color)', fontSize: '0.9rem', margin: 0 }}>
                  Estimated spend for next month based on current trajectory.
                </p>
              </div>
            </GlassCard>

            <GlassCard elevation="medium">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
                <Lightbulb size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>Recommendations</h3>
              </div>
              <ul style={{ paddingLeft: 'var(--space-lg)', margin: 0, color: 'var(--text-muted-color)' }}>
                {insights?.recommendations?.map((rec: string, i: number) => (
                  <li key={i} style={{ marginBottom: 'var(--space-sm)' }}>{rec}</li>
                )) || <li>No current recommendations.</li>}
              </ul>
            </GlassCard>

            <GlassCard elevation="medium">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
                <AlertTriangle size={20} color="#ff8a80" />
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>Anomalies</h3>
              </div>
              <ul style={{ paddingLeft: 'var(--space-lg)', margin: 0, color: 'var(--text-muted-color)' }}>
                {insights?.anomalies?.map((an: string, i: number) => (
                  <li key={i} style={{ marginBottom: 'var(--space-sm)' }}>{an}</li>
                )) || <li>No anomalies detected.</li>}
              </ul>
            </GlassCard>

            <GlassCard elevation="medium">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
                <TrendingUp size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>Trend Analysis</h3>
              </div>
              <p style={{ color: 'var(--text-muted-color)' }}>
                {insights?.trends?.summary || "Your spending is stable."}
              </p>
              {/* Add Chart Placeholder */}
              <div style={{ height: '150px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', marginTop: 'var(--space-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <span style={{ color: 'var(--text-muted-color)', fontSize: '0.85rem' }}>Visual Chart Loading...</span>
              </div>
            </GlassCard>

          </div>
        )}
      </Reveal>
    </PageTransition>
  );
}

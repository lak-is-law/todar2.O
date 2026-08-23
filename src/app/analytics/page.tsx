'use client';

import React, { useEffect, useState } from 'react';
import { PageTransition } from '@/components/motion/PageTransition';
import { Reveal } from '@/components/motion/Reveal';
import { GlassCard } from '@/components/ui/GlassCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Download, FileText, IndianRupee, PieChart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AnalyticsPage() {
  const router = useRouter();
  const [taxData, setTaxData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fy, setFy] = useState('2023-2024');

  const { status } = useSession();

  useEffect(() => {
    const fetchTaxData = async () => {
      setLoading(true);
      if (status !== 'authenticated') return;

      try {
        const res = await fetch(`/api/tax-returns?fy=${fy}`);
        
        if (res.status === 401) {
          router.push('/login');
          return;
        }

        if (res.ok) {
          const data = await res.json();
          setTaxData(data);
        }
      } catch (err) {
        console.error('Failed to fetch tax data', err);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchTaxData();
    }
  }, [fy, status, router]);

  return (
    <PageTransition>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2xl)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <Reveal width="100%">
          <h1 style={{ marginBottom: 'var(--space-xs)' }}>Analytics & Tax Returns</h1>
          <p style={{ color: 'var(--text-muted-color)', margin: 0 }}>Review financial years for ITR support.</p>
        </Reveal>
        
        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
          <select 
            value={fy} 
            onChange={(e) => setFy(e.target.value)}
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
            <option value="2023-2024">FY 2023-2024</option>
            <option value="2022-2023">FY 2022-2023</option>
          </select>
          <PremiumButton variant="secondary" icon={<Download size={18} />} disabled={loading}>
            Export ITR Report
          </PremiumButton>
          <PremiumButton icon={<Download size={18} />}>
            Export PDF
          </PremiumButton>
        </div>
      </div>

      <Reveal delay={0.1}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-4xl) 0' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-xl)' }}>
            
            <GlassCard elevation="medium">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
                <PieChart size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>Category Totals ({fy})</h3>
              </div>
              <div style={{ height: '250px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px dashed rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'var(--text-muted-color)', fontSize: '0.9rem' }}>Tax Chart Loading...</span>
              </div>
            </GlassCard>

            <GlassCard elevation="medium">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
                <FileText size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>Summary</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {taxData?.categoryTotals?.map((cat: any, i: number) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--space-sm)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: 'var(--text-muted-color)' }}>{cat.category}</span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500 }}>₹{cat.total.toLocaleString('en-IN')}</span>
                  </div>
                )) || (
                  <p style={{ color: 'var(--text-muted-color)', fontStyle: 'italic' }}>No tax data found for this period.</p>
                )}
                
                {taxData?.categoryTotals?.length > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
                    <span style={{ color: 'var(--text)', fontWeight: 600 }}>Total Deductible Spend</span>
                    <span style={{ fontFamily: 'var(--font-sans)', color: 'var(--primary)', fontWeight: 700, fontSize: '1.2rem' }}>
                      ₹{taxData.categoryTotals.reduce((sum: number, c: any) => sum + c.total, 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>
            </GlassCard>

          </div>
        )}
      </Reveal>
    </PageTransition>
  );
}

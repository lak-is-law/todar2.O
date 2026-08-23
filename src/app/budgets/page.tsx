'use client';

import React, { useEffect, useState } from 'react';
import { PageTransition } from '@/components/motion/PageTransition';
import { Reveal } from '@/components/motion/Reveal';
import { GlassCard } from '@/components/ui/GlassCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Target, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function BudgetsPage() {
  const router = useRouter();
  const [budgetLimit, setBudgetLimit] = useState(5000);
  const [totalSpending, setTotalSpending] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const { status } = useSession();

  useEffect(() => {
    async function fetchBudgets() {
      if (status !== 'authenticated') return;

      try {
        const res = await fetch(`/api/dashboard`);
        
        if (res.ok) {
          const data = await res.json();
          setBudgetLimit(data.budgetLimit || 5000);
          setTotalSpending(data.totalSpending || 0);
        }
      } catch (err) {
        console.error('Failed to fetch budgets data', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBudgets();
  }, [status, router]);

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      const res = await fetch(`/api/budget`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: budgetLimit })
      });

      if (res.ok) {
        setSuccessMsg('Budget updated successfully.');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error('Failed to save budget', err);
    } finally {
      setSaving(false);
    }
  };

  const budgetProgress = budgetLimit > 0 ? (totalSpending / budgetLimit) * 100 : 0;

  return (
    <PageTransition>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2xl)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <Reveal width="100%">
          <h1 style={{ marginBottom: 'var(--space-xs)' }}>Budget Target</h1>
          <p style={{ color: 'var(--text-muted-color)', margin: 0 }}>Set and track your monthly spending limits.</p>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-4xl) 0' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--space-xl)' }}>
            
            <GlassCard elevation="medium">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
                <Target size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>Monthly Budget</h3>
              </div>
              
              <form onSubmit={handleSaveBudget} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                  <label htmlFor="budget" style={{ fontSize: '0.9rem', color: 'var(--text)', fontWeight: 500 }}>Target Amount (₹)</label>
                  <input 
                    id="budget"
                    type="number"
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(Number(e.target.value))}
                    min={0}
                    step={100}
                    required
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-md)',
                      color: 'var(--text)',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'border-color var(--duration-fast)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                  />
                </div>

                <PremiumButton type="submit" disabled={saving} icon={<Save size={18} />}>
                  {saving ? 'Saving...' : 'Save Target'}
                </PremiumButton>

                {successMsg && (
                  <div style={{ padding: 'var(--space-sm)', background: 'rgba(168, 138, 82, 0.1)', color: 'var(--primary)', borderRadius: 'var(--radius-sm)', textAlign: 'center', fontSize: '0.9rem' }}>
                    {successMsg}
                  </div>
                )}
              </form>
            </GlassCard>

            <GlassCard elevation="medium">
              <h3 style={{ margin: '0 0 var(--space-lg) 0', fontFamily: 'var(--font-display)', color: 'var(--text)' }}>Current Status</h3>
              
              <div style={{ marginBottom: 'var(--space-xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
                  <span style={{ color: 'var(--text-muted-color)' }}>Spending</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600 }}>₹{totalSpending.toLocaleString('en-IN')} / ₹{budgetLimit.toLocaleString('en-IN')}</span>
                </div>
                
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    background: budgetProgress > 100 ? '#ff8a80' : 'var(--primary)', 
                    width: `${Math.min(budgetProgress, 100)}%`,
                    transition: 'width var(--duration-normal) var(--motion-primary)'
                  }} />
                </div>
                <p style={{ marginTop: 'var(--space-xs)', fontSize: '0.8rem', color: budgetProgress > 100 ? '#ff8a80' : 'var(--text-muted-color)', textAlign: 'right' }}>
                  {budgetProgress.toFixed(1)}% Used
                </p>
              </div>

              {budgetProgress > 100 && (
                <div style={{ padding: 'var(--space-md)', background: 'rgba(255, 138, 128, 0.1)', color: '#ff8a80', border: '1px solid rgba(255, 138, 128, 0.3)', borderRadius: 'var(--radius-sm)' }}>
                  <h4 style={{ margin: '0 0 var(--space-xs) 0', display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                    <Target size={16} /> Budget Exceeded
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>
                    You have exceeded your monthly budget target by ₹{(totalSpending - budgetLimit).toLocaleString('en-IN')}. Consider reducing expenses.
                  </p>
                </div>
              )}
            </GlassCard>

          </div>
        )}
      </Reveal>
    </PageTransition>
  );
}

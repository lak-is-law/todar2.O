'use client';

import React, { useEffect, useState } from 'react';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { InsightsCard } from '@/components/dashboard/InsightsCard';
import { TransactionList } from '@/components/finance/TransactionList';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Plus, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

import { Reveal } from '@/components/motion/Reveal';
import { PageTransition } from '@/components/motion/PageTransition';

const DashboardScene = dynamic(() => import('@/components/three/DashboardScene'), {
  ssr: false,
  loading: () => <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner"></div></div>
});

export default function Home() {
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { status } = useSession();

  useEffect(() => {
    async function fetchReport() {
      if (status !== 'authenticated') return;

      try {
        const res = await fetch(`/api/dashboard`);
        
        if (res.status === 401) {
          router.push('/login');
          return;
        }

        if (res.ok) {
          const data = await res.json();
          setReport(data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [status, router]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--primary)' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div style={{ textAlign: 'center', marginTop: 'var(--space-4xl)' }}>
        <h2>Unable to load dashboard</h2>
        <p style={{ color: 'var(--text-muted-color)' }}>Make sure the backend is running.</p>
      </div>
    );
  }

  return (
    <PageTransition>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2xl)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <Reveal width="100%">
          <div style={{ display: 'flex', gap: 'var(--space-xl)', alignItems: 'center' }}>
            <div style={{ width: '80px', height: '80px' }}>
              <DashboardScene />
            </div>
            <div>
              <h1 style={{ marginBottom: 'var(--space-xs)' }}>Dashboard</h1>
              <p style={{ color: 'var(--text-muted-color)', margin: 0 }}>Here's your financial overview for this month.</p>
            </div>
          </div>
        </Reveal>
        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
          <PremiumButton variant="secondary" icon={<Download size={18} />}>
            Export Report
          </PremiumButton>
          <PremiumButton icon={<Plus size={18} />}>
            Add Expense
          </PremiumButton>
        </div>
      </div>

      <Reveal delay={0.1}>
        <StatsGrid 
          totalSpending={report.totalSpending || 0}
          expenseCount={report.expenses?.length || 0}
          nextMonthPrediction={report.monthlyTotals?.[0]?.total || 0} 
          budgetProgress={report.budgetLimit ? ((report.totalSpending || 0) / report.budgetLimit) * 100 : 0}
          budgetLimit={report.budgetLimit || 5000}
        />
      </Reveal>

      <Reveal delay={0.2}>
        <InsightsCard 
          categories={report.categoryTotals || []}
          trends={report.monthlyTotals || []}
        />
      </Reveal>

      <div style={{ marginTop: 'var(--space-2xl)' }}>
        <Reveal delay={0.3}>
          <TransactionList transactions={report.expenses || []} limit={5} />
        </Reveal>
      </div>
    </PageTransition>
  );
}

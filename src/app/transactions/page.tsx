'use client';

import React, { useEffect, useState } from 'react';
import { PageTransition } from '@/components/motion/PageTransition';
import { Reveal } from '@/components/motion/Reveal';
import { TransactionList } from '@/components/finance/TransactionList';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Plus, Filter, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function TransactionsPage() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { status } = useSession();

  useEffect(() => {
    async function fetchExpenses() {
      if (status !== 'authenticated') return;

      try {
        const res = await fetch(`/api/expenses`);
        
        if (res.status === 401) {
          router.push('/login');
          return;
        }

        if (res.ok) {
          const data = await res.json();
          setExpenses(data);
        }
      } catch (err) {
        console.error('Failed to fetch expenses', err);
      } finally {
        setLoading(false);
      }
    }

    fetchExpenses();
  }, [status, router]);

  return (
    <PageTransition>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2xl)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <Reveal width="100%">
          <h1 style={{ marginBottom: 'var(--space-xs)' }}>All Transactions</h1>
          <p style={{ color: 'var(--text-muted-color)', margin: 0 }}>View, search, and export your expense history.</p>
        </Reveal>
        
        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
          <PremiumButton variant="secondary" icon={<Filter size={18} />}>
            Filter
          </PremiumButton>
          <PremiumButton variant="secondary" icon={<Download size={18} />}>
            Export PDF
          </PremiumButton>
          <PremiumButton icon={<Plus size={18} />}>
            Add Expense
          </PremiumButton>
        </div>
      </div>

      <Reveal delay={0.1}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-4xl) 0' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <TransactionList transactions={expenses} />
        )}
      </Reveal>
    </PageTransition>
  );
}

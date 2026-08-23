import React from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { ShoppingBag, Plane, Coffee, CreditCard, Utensils } from 'lucide-react';
import styles from './TransactionList.module.css';

interface Transaction {
  id: number;
  date: string;
  category: string;
  description: string;
  amount: number;
}

interface TransactionListProps {
  transactions: Transaction[];
  limit?: number;
}

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category.toLowerCase()) {
    case 'food':
      return <Utensils size={18} />;
    case 'travel':
      return <Plane size={18} />;
    case 'shopping':
      return <ShoppingBag size={18} />;
    case 'coffee':
      return <Coffee size={18} />;
    default:
      return <CreditCard size={18} />;
  }
};

export const TransactionList = React.memo(function TransactionList({ transactions, limit }: TransactionListProps) {
  const displayedTransactions = limit ? transactions.slice(0, limit) : transactions;

  return (
    <GlassCard elevation="low" className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>{limit ? 'Recent Transactions' : 'All Transactions'}</h3>
        {limit && (
          <Link href="/transactions" className={styles.viewAll} aria-label="View all transactions">
            View All
          </Link>
        )}
      </div>

      <div className={styles.list}>
        {displayedTransactions.length === 0 ? (
          <p className={styles.emptyState}>No transactions found.</p>
        ) : (
          displayedTransactions.map((t) => {
            const dateStr = new Date(t.date).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div key={t.id} className={styles.row}>
                <div className={styles.iconWrapper}>
                  <CategoryIcon category={t.category} />
                </div>
                
                <div className={styles.details}>
                  <h4 className={styles.description}>{t.description || t.category}</h4>
                  <span className={styles.date}>{dateStr} • {t.category}</span>
                </div>

                <div className={styles.amount}>
                  -₹{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </GlassCard>
  );
});

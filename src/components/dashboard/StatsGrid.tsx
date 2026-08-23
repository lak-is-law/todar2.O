import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { IndianRupee, PieChart, BrainCircuit, Target, Percent } from 'lucide-react';
import styles from './StatsGrid.module.css';

interface StatsProps {
  totalSpending: number;
  expenseCount: number;
  nextMonthPrediction: number;
  budgetProgress: number;
  budgetLimit: number;
}

export const StatsGrid = React.memo(function StatsGrid({ 
  totalSpending, 
  expenseCount, 
  nextMonthPrediction,
  budgetProgress,
  budgetLimit
}: StatsProps) {
  return (
    <div className={styles.grid}>
      <GlassCard elevation="low" className={styles.statCard}>
        <div className={styles.iconWrapper}>
          <IndianRupee size={20} className={styles.icon} />
        </div>
        <div className={styles.content}>
          <h3 className={styles.value}>₹{totalSpending.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h3>
          <p className={styles.label}>Total This Month</p>
        </div>
      </GlassCard>

      <GlassCard elevation="low" className={styles.statCard}>
        <div className={styles.iconWrapper}>
          <PieChart size={20} className={styles.icon} />
        </div>
        <div className={styles.content}>
          <h3 className={styles.value}>{expenseCount}</h3>
          <p className={styles.label}>Total Expenses</p>
        </div>
      </GlassCard>

      <GlassCard elevation="low" className={styles.statCard}>
        <div className={styles.iconWrapper}>
          <BrainCircuit size={20} className={styles.icon} />
        </div>
        <div className={styles.content}>
          <h3 className={styles.value}>₹{nextMonthPrediction.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h3>
          <p className={styles.label}>Next Month Prediction</p>
        </div>
      </GlassCard>

      <GlassCard elevation="low" className={styles.statCard}>
        <div className={styles.iconWrapper}>
          <Percent size={20} className={styles.icon} />
        </div>
        <div className={styles.content}>
          <h3 className={styles.value}>{budgetProgress.toFixed(1)}%</h3>
          <p className={styles.label}>Budget Used</p>
        </div>
      </GlassCard>

      <GlassCard elevation="low" className={styles.statCardTarget}>
        <div className={styles.iconWrapper}>
          <Target size={20} className={styles.icon} />
        </div>
        <div className={styles.content}>
          <h3 className={styles.value}>₹{budgetLimit.toLocaleString('en-IN')}</h3>
          <p className={styles.label}>Monthly Target</p>
        </div>
      </GlassCard>
    </div>
  );
});

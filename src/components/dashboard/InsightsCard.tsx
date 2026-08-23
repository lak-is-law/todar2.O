import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { PieChart, TrendingUp } from 'lucide-react';
import styles from './InsightsCard.module.css';

interface CategoryTotal {
  category: string;
  total: number;
}

interface TrendTotal {
  month: string;
  total: number;
}

interface InsightsCardProps {
  categories: CategoryTotal[];
  trends: TrendTotal[];
}

export const InsightsCard = React.memo(function InsightsCard({ categories, trends }: InsightsCardProps) {
  // In a real implementation we would render charts here using custom SVGs or Framer Motion
  // For now, we will render a sophisticated list view of the categories and a placeholder for the trend

  const total = categories.reduce((sum, c) => sum + c.total, 0);

  return (
    <div className={styles.grid}>
      <GlassCard elevation="medium" className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <PieChart size={18} />
          </div>
          <h3 className={styles.title}>Category Breakdown</h3>
        </div>
        
        <div className={styles.categoryList}>
          {categories.slice(0, 5).map(cat => {
            const percentage = total > 0 ? (cat.total / total) * 100 : 0;
            return (
              <div key={cat.category} className={styles.categoryItem}>
                <div className={styles.categoryInfo}>
                  <span className={styles.categoryName}>{cat.category}</span>
                  <span className={styles.categoryValue}>₹{cat.total.toLocaleString()}</span>
                </div>
                <div className={styles.progressBarBg}>
                  <div 
                    className={styles.progressBarFill} 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
          {categories.length === 0 && (
            <p className={styles.emptyState}>No data for this month.</p>
          )}
        </div>
      </GlassCard>

      <GlassCard elevation="medium" className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <TrendingUp size={18} />
          </div>
          <h3 className={styles.title}>Monthly Trend</h3>
        </div>
        
        <div className={styles.trendContainer}>
          {/* We will implement a custom SVG chart later as per Phase 6/8, for now a sophisticated placeholder */}
          <div className={styles.chartPlaceholder}>
            {trends.length > 0 ? (
              <div className={styles.barChart}>
                {trends.map((trend, i) => {
                  const maxTotal = Math.max(...trends.map(t => t.total));
                  const height = maxTotal > 0 ? (trend.total / maxTotal) * 100 : 0;
                  return (
                    <div key={i} className={styles.barCol}>
                      <div className={styles.barWrapper}>
                        <div className={styles.barFill} style={{ height: `${height}%` }} />
                      </div>
                      <span className={styles.barLabel}>{trend.month.split('-')[1]}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className={styles.emptyState}>Not enough data to show trends.</p>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
});

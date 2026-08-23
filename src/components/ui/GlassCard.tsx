import React from 'react';
import clsx from 'clsx';
import styles from './GlassCard.module.css';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  elevation?: 'low' | 'medium' | 'high';
  className?: string;
}

export function GlassCard({ children, elevation = 'low', className, ...props }: GlassCardProps) {
  return (
    <div 
      className={clsx(
        styles.glassCard,
        styles[`elevation-${elevation}`],
        className
      )} 
      {...props}
    >
      <div className={styles.glassHighlight} />
      <div className={styles.glassContent}>
        {children}
      </div>
    </div>
  );
}

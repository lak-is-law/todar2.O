import React from 'react';
import clsx from 'clsx';
import styles from './PremiumButton.module.css';

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export function PremiumButton({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className,
  ...props
}: PremiumButtonProps) {
  return (
    <button
      className={clsx(
        styles.premiumButton,
        styles[variant],
        styles[size],
        className
      )}
      {...props}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.content}>{children}</span>
    </button>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { 
  LayoutDashboard, 
  ReceiptText, 
  LineChart, 
  Target, 
  Sparkles, 
  Settings, 
  User 
} from 'lucide-react';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transactions', icon: ReceiptText },
  { href: '/analytics', label: 'Analytics', icon: LineChart },
  { href: '/budgets', label: 'Budgets', icon: Target },
  { href: '/insights', label: 'Insights', icon: Sparkles },
];

const BOTTOM_NAV_ITEMS = [
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/profile', label: 'Profile', icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          {/* Subtle architectural arch motif behind logo */}
          <div className={styles.logoArch}></div>
          <span className={styles.logoText}>TODAR</span>
        </div>
      </div>

      <nav className={styles.navigation}>
        <div className={styles.navGroup}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={clsx(styles.navItem, isActive && styles.active)}
              >
                <span className={styles.iconWrapper}>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                </span>
                <span className={styles.label}>{item.label}</span>
                {isActive && <motion.div className={styles.activeIndicator} layoutId="activeNav" />}
              </Link>
            );
          })}
        </div>

        <div className={styles.navGroupBottom}>
          {BOTTOM_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={clsx(styles.navItem, isActive && styles.active)}
              >
                <span className={styles.iconWrapper}>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                </span>
                <span className={styles.label}>{item.label}</span>
                {isActive && <motion.div className={styles.activeIndicator} layoutId="activeNav" />}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}

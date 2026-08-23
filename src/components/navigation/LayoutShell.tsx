'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import styles from './LayoutShell.module.css';
import { Menu, Bell, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface LayoutShellProps {
  children: React.ReactNode;
}

export function LayoutShell({ children }: LayoutShellProps) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (isAuthPage) {
    return <main className={styles.authWrapper}>{children}</main>;
  }

  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.mainWrapper}>
        {/* Mobile Topbar */}
        <header className={styles.topbar}>
          <div className={styles.mobileNav}>
            <button className={styles.iconButton} aria-label="Open menu">
              <Menu size={20} />
            </button>
            <span className={styles.logoText}>TODAR</span>
          </div>
          
          <div className={styles.topbarActions}>
            <button className={styles.iconButton} aria-label="Search">
              <Search size={20} />
            </button>
            <button className={styles.iconButton} aria-label="Notifications">
              <Bell size={20} />
            </button>
          </div>
        </header>

        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  );
}

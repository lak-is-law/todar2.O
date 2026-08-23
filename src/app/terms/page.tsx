'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Reveal } from '@/components/motion/Reveal';
import { PageTransition } from '@/components/motion/PageTransition';
import { Check, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './Terms.module.css';

export default function TermsPage() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = () => {
    setIsLoading(true);
    // In a real application, you would make an API call to save the user's acceptance status
    setTimeout(() => {
      router.push('/');
    }, 800);
  };

  return (
    <PageTransition>
      <div className={styles.container}>
        <Reveal>
          <GlassCard elevation="high" className={styles.termsCard}>
            <div className={styles.header}>
              <h1 className={styles.title}>Terms & Conditions</h1>
              <p className={styles.subtitle}>Effective Date: August 2026</p>
            </div>

            <div className={styles.contentScroll}>
              <div className={styles.section}>
                <h3>1. Acceptance of Terms</h3>
                <p>
                  By accessing and using the TODAR platform ("Platform"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this Platform's particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                </p>
              </div>

              <div className={styles.section}>
                <h3>2. Financial Disclaimer</h3>
                <p>
                  The TODAR platform provides financial intelligence, analytics, and budgeting tools for informational purposes only. The information provided through our Service does not constitute financial, investment, legal, or tax advice. You acknowledge that any decisions made based on the insights provided by our platform are solely at your own risk.
                </p>
              </div>

              <div className={styles.section}>
                <h3>3. Data Privacy and Security</h3>
                <p>
                  We employ bank-grade encryption to protect your financial data. We do not sell your personal financial information to third parties. By using our service, you consent to the collection, processing, and storage of your financial data as outlined in our comprehensive Privacy Policy.
                </p>
              </div>

              <div className={styles.section}>
                <h3>4. Account Responsibilities</h3>
                <p>
                  You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account or any other breaches of security.
                </p>
              </div>

              <div className={styles.section}>
                <h3>5. Intellectual Property</h3>
                <p>
                  All content included on the Platform, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of TODAR or its content suppliers and protected by international copyright laws.
                </p>
              </div>

              <div className={styles.section}>
                <h3>6. Modifications to Service</h3>
                <p>
                  We reserve the right at any time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. We shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the Service.
                </p>
              </div>
            </div>

            <div className={styles.footer}>
              <label className={styles.checkboxContainer}>
                <input 
                  type="checkbox" 
                  style={{ display: 'none' }} 
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                />
                <div className={styles.checkboxWrapper}>
                  <Check size={16} className={styles.checkIcon} strokeWidth={3} />
                </div>
                <div className={styles.checkboxText}>
                  I have read, understood, and agree to the TODAR Terms & Conditions and Privacy Policy.
                  <br />
                  <a 
                    href="https://todar.finance.lakshya.uk/contactus/in" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.link}
                  >
                    Learn more
                  </a>
                </div>
              </label>

              <div className={styles.actions}>
                <PremiumButton 
                  variant="secondary" 
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Decline
                </PremiumButton>
                
                <PremiumButton 
                  onClick={handleAccept} 
                  disabled={!accepted || isLoading}
                  icon={<ArrowRight size={18} />}
                >
                  {isLoading ? 'Processing...' : 'Accept & Continue'}
                </PremiumButton>
              </div>
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </PageTransition>
  );
}

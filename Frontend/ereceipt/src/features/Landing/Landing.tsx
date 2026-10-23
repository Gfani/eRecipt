import React, { useState } from 'react';
import logoImg from '../../assets/logo.png';
import logoWhiteImg from '../../assets/logo-white.png';
import styles from './LandingPage.module.css';

export interface LandingPageProps {
  onSignInClick?: () => void;
  onGetStartedClick?: () => void;
  onScanReceiptClick?: () => void;
  onMerchantPortalClick?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSignInClick,
  onGetStartedClick,
  onScanReceiptClick,
  onMerchantPortalClick,
}) => {
  const [activeLang, setActiveLang] = useState<'EN' | 'አማ'>('EN');

  return (
    <div className={styles.pageWrapper}>
      {/* ─── 1. NAVBAR ────────────────────────────────────────── */}
      <header className={styles.navbar}>
        <div className={styles.navContainer}>
          <a
            href="/"
            className={styles.brandLogo}
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <img
              src={logoImg}
              alt="eReceipt - Digital Receipts. A Stronger Ethiopia."
              className={styles.logoImg}
            />
          </a>

          <nav className={styles.navLinks}>
            <a href="#home" className={`${styles.navLink} ${styles.navLinkActive}`}>Home</a>
            <a href="#how-it-works" className={styles.navLink}>How It Works</a>
            <a href="#customers" className={styles.navLink}>For Customers</a>
            <a href="#merchants" className={styles.navLink}>For Merchants</a>
            <a href="#about" className={styles.navLink}>About</a>
          </nav>

          <div className={styles.navActions}>
            <button
              type="button"
              className={styles.langSelector}
              onClick={() => setActiveLang(activeLang === 'EN' ? 'አማ' : 'EN')}
            >
              <span>{activeLang}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <a
              href="/login"
              className={styles.btnSecondary}
              onClick={(e) => {
                if (onSignInClick) {
                  e.preventDefault();
                  onSignInClick();
                }
              }}
            >
              Sign In
            </a>
            <a
              href="/merchant/register"
              className={styles.btnPrimary}
              onClick={(e) => {
                if (onGetStartedClick) {
                  e.preventDefault();
                  onGetStartedClick();
                }
              }}
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* ─── 2. HERO SECTION ─────────────────────────────────── */}
      <section id="home" className={styles.heroSection}>
        <div className={styles.heroContainer}>
          {/* Left Column: Headlines & Portal Launchers */}
          <div className={styles.heroLeft}>
            <span className={styles.eyebrowBadge}>DIGITAL RECEIPTS FOR A SMARTER ETHIOPIA</span>
            <h1 className={styles.heroHeadline}>
              Every purchase leaves a trace. <br />
              <span className={styles.heroHeadlineHighlight}>Make it digital.</span>
            </h1>
            <p className={styles.heroDescription}>
              eReceipt helps you access your purchase receipts digitally, verify their authenticity,
              and manage your records — whether you’re a customer or a business owner.
            </p>

            {/* Customer & Merchant Dual Portal Cards */}
            <div className={styles.portalCardsRow}>
              {/* Customer Box */}
              <div className={styles.portalCard}>
                <div className={styles.portalCardHeader}>
                  <div className={`${styles.portalIcon} ${styles.customerIconBg}`}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 7V4h3" />
                      <path d="M20 7V4h-3" />
                      <path d="M4 17v3h3" />
                      <path d="M20 17v3h-3" />
                      <line x1="9" y1="12" x2="15" y2="12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className={styles.portalTitle}>I'm a Customer</h3>
                    <p className={styles.portalSubtitle}>
                      Scan a receipt QR code to view, verify, and keep your purchase records in one place.
                    </p>
                  </div>
                </div>
                <a
                  href="/scan"
                  className={styles.portalCtaBtn}
                  onClick={(e) => {
                    if (onScanReceiptClick) {
                      e.preventDefault();
                      onScanReceiptClick();
                    }
                  }}
                >
                  <span>Scan Receipt</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>

              {/* Merchant Box */}
              <div className={styles.portalCard}>
                <div className={styles.portalCardHeader}>
                  <div className={`${styles.portalIcon} ${styles.merchantIconBg}`}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </div>
                  <div>
                    <h3 className={styles.portalTitle}>I'm a Merchant</h3>
                    <p className={styles.portalSubtitle}>
                      Register your business or sign in to manage your digital receipts.
                    </p>
                  </div>
                </div>
                <a
                  href="/merchant/login"
                  className={`${styles.portalCtaBtn} ${styles.portalCtaBtnSecondary}`}
                  onClick={(e) => {
                    if (onSignInClick || onMerchantPortalClick) {
                      e.preventDefault();
                      if (onMerchantPortalClick) {
                        onMerchantPortalClick();
                      } else if (onSignInClick) {
                        onSignInClick();
                      }
                    }
                  }}
                >
                  <span>Merchant Portal</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Trust Badges Bar */}
            <div className={styles.heroTrustBadges}>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>🌱</span>
                <div>
                  <strong>Paperless</strong>
                  <p>Reduce paper waste</p>
                </div>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>🛡️</span>
                <div>
                  <strong>Secure</strong>
                  <p>Your data is protected</p>
                </div>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>⚡</span>
                <div>
                  <strong>Efficient</strong>
                  <p>Save time and stay organized</p>
                </div>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>🇪🇹</span>
                <div>
                  <strong>Built for Ethiopia</strong>
                  <p>Designed for local businesses</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Mobile Digital Mockup + Paper Receipt Comparison */}
          <div className={styles.heroRight}>
            <div className={styles.heroVisualComposition}>
              {/* Phone Mockup with Digital Receipt */}
              <div className={styles.phoneDeviceMockup}>
                <div className={styles.phoneScreen}>
                  <div className={styles.verifiedHeader}>
                    <div className={styles.verifiedCheckBadge}>✓</div>
                    <span>Receipt Verified</span>
                  </div>
                  <h4 className={styles.mockupStoreName}>Addis Mart</h4>
                  <p className={styles.mockupBranch}>Bole, Addis Ababa</p>
                  <div className={styles.mockupMeta}>
                    <span>Receipt No: #RC-2025-0048</span>
                    <span>Date: Apr 26, 2026 • 10:24 AM</span>
                  </div>
                  <div className={styles.mockupLineItems}>
                    <div className={styles.mockupRow}><span>Injera (10)</span><span>65.00</span></div>
                    <div className={styles.mockupRow}><span>Doro Wat (1)</span><span>120.00</span></div>
                    <div className={styles.mockupRow}><span>Ayran (1)</span><span>25.00</span></div>
                  </div>
                  <div className={styles.mockupSummary}>
                    <div className={styles.mockupRow}><span>Subtotal</span><span>210.00</span></div>
                    <div className={styles.mockupRow}><span>VAT (15%)</span><span>31.50</span></div>
                    <div className={`${styles.mockupRow} ${styles.mockupTotalRow}`}>
                      <strong>Total</strong>
                      <strong>ETB 241.50</strong>
                    </div>
                  </div>
                  <div className={styles.mockupQrWrapper}>
                    <div className={styles.mockupQrMatrix}></div>
                    <span className={styles.mockupQrCaption}>Scan to verify</span>
                  </div>
                </div>
              </div>

              {/* Physical Paper Receipt */}
              <div className={styles.paperReceiptCard}>
                <div className={styles.paperReceiptHeader}>
                  <div className={styles.paperStoreLogo}>▲</div>
                  <h4>Addis Mart</h4>
                  <p>Good Food, Better Days</p>
                </div>
                <div className={styles.paperMeta}>
                  <div>Receipt No: #RC-2025-0048</div>
                  <div>Date: Apr 26, 2026 • 10:24 AM</div>
                </div>
                <div className={styles.paperItems}>
                  <div className={styles.paperItemRow}><span>Injera</span><span>65.00</span></div>
                  <div className={styles.paperItemRow}><span>Doro Wat</span><span>120.00</span></div>
                  <div className={styles.paperItemRow}><span>Ayran</span><span>25.00</span></div>
                </div>
                <div className={styles.paperDivider}></div>
                <div className={styles.paperSummary}>
                  <div className={styles.paperItemRow}><span>Subtotal</span><span>210.00</span></div>
                  <div className={styles.paperItemRow}><span>VAT (15%)</span><span>31.50</span></div>
                  <div className={`${styles.paperItemRow} ${styles.paperTotal}`}>
                    <span>Total</span>
                    <span>ETB 241.50</span>
                  </div>
                </div>
                <p className={styles.paperFooterMsg}>Thank you!<br />Come again</p>
                <div className={styles.paperTapePencilTag}>
                  <span>Verified receipts. Greater trust.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. HOW IT WORKS ─────────────────────────────────── */}
      <section id="how-it-works" className={styles.howItWorksSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionPre}>HOW IT WORKS</span>
          <h2 className={styles.sectionHeadline}>Simple steps. Real value.</h2>
          <p className={styles.sectionSub}>
            Getting your digital receipt is quick and easy. Follow these steps whether you're a customer or a merchant.
          </p>
        </div>

        <div className={styles.stepsTimelineGrid}>
          {/* Step 1 */}
          <div className={styles.timelineCard}>
            <div className={styles.timelineTop}>
              <div className={styles.timelineIconWrapper}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                </svg>
              </div>
              <span className={styles.timelineStepNumber}>01</span>
            </div>
            <h4 className={styles.stepTitle}>Shop</h4>
            <p className={styles.stepDesc}>Make a purchase from a participating merchant.</p>
          </div>

          <div className={styles.stepConnectorArrow}>→</div>

          {/* Step 2 */}
          <div className={styles.timelineCard}>
            <div className={styles.timelineTop}>
              <div className={styles.timelineIconWrapper}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                  <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                  <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                  <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                </svg>
              </div>
              <span className={styles.timelineStepNumber}>02</span>
            </div>
            <h4 className={styles.stepTitle}>Scan</h4>
            <p className={styles.stepDesc}>Scan the QR code on your receipt to access the digital record.</p>
          </div>

          <div className={styles.stepConnectorArrow}>→</div>

          {/* Step 3 */}
          <div className={styles.timelineCard}>
            <div className={styles.timelineTop}>
              <div className={styles.timelineIconWrapper}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <span className={styles.timelineStepNumber}>03</span>
            </div>
            <h4 className={styles.stepTitle}>View</h4>
            <p className={styles.stepDesc}>See your receipt details, verify the information, or save it to your account.</p>
          </div>

          <div className={styles.stepConnectorArrow}>→</div>

          {/* Step 4 */}
          <div className={styles.timelineCard}>
            <div className={styles.timelineTop}>
              <div className={styles.timelineIconWrapper}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                </svg>
              </div>
              <span className={styles.timelineStepNumber}>04</span>
            </div>
            <h4 className={styles.stepTitle}>Save / Manage</h4>
            <p className={styles.stepDesc}>Keep your receipts accessible for future reference.</p>
          </div>
        </div>
      </section>

      {/* ─── 4. SPLIT AUDIENCE: CUSTOMERS & MERCHANTS ─────────── */}
      <section className={styles.audienceSection}>
        <div className={styles.audienceContainer}>
          {/* For Customers */}
          <div id="customers" className={styles.audienceCard}>
            <span className={styles.sectionPre}>FOR CUSTOMERS</span>
            <h3 className={styles.audienceHeadline}>More control. More convenience.</h3>
            <p className={styles.audienceDesc}>
              Access your receipts, verify their authenticity, and keep your purchase history organized — all in one place.
            </p>

            <ul className={styles.checklist}>
              <li>
                <span className={styles.checkIcon}>✓</span>
                <span>Scan QR codes to view digital receipts</span>
              </li>
              <li>
                <span className={styles.checkIcon}>✓</span>
                <span>Keep your purchase records organized</span>
              </li>
              <li>
                <span className={styles.checkIcon}>✓</span>
                <span>Retrieve previously saved receipts</span>
              </li>
              <li>
                <span className={styles.checkIcon}>✓</span>
                <span>Verify receipt details where supported</span>
              </li>
            </ul>

            <a href="/customers" className={styles.actionGreenBtn}>
              <span>Explore Customer Features</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Center Graphic Phone */}
          <div className={styles.audienceCenterVisual}>
            <div className={styles.vaultPhoneFrame}>
              <div className={styles.vaultPhoneHeader}>My Receipts</div>
              <div className={styles.vaultReceiptItem}>
                <div><strong>Addis Mart</strong><p>Apr 26, 2026 • ETB 241.50</p></div>
                <span>›</span>
              </div>
              <div className={styles.vaultReceiptItem}>
                <div><strong>Salem Supermarket</strong><p>Apr 24, 2026 • ETB 680.00</p></div>
                <span>›</span>
              </div>
              <div className={styles.vaultReceiptItem}>
                <div><strong>TechHouse</strong><p>Apr 20, 2026 • ETB 3,450.00</p></div>
                <span>›</span>
              </div>
              <div className={styles.vaultReceiptItem}>
                <div><strong>Kaldis Café</strong><p>Apr 19, 2026 • ETB 185.00</p></div>
                <span>›</span>
              </div>
            </div>
          </div>

          {/* For Merchants */}
          <div id="merchants" className={styles.audienceCard}>
            <span className={styles.sectionPre}>FOR MERCHANTS</span>
            <h3 className={styles.audienceHeadline}>Register. Verify. Grow.</h3>
            <p className={styles.audienceDesc}>
              Join eReceipt to manage your business, issue digital receipts, and track your sales — with the right authorization.
            </p>

            <ul className={styles.checklist}>
              <li>
                <span className={styles.checkIcon}>✓</span>
                <span>Apply for merchant registration</span>
              </li>
              <li>
                <span className={styles.checkIcon}>✓</span>
                <span>Submit required business and tax documents</span>
              </li>
              <li>
                <span className={styles.checkIcon}>✓</span>
                <span>Track verification and approval status</span>
              </li>
              <li>
                <span className={styles.checkIcon}>✓</span>
                <span>Access receipt-management features after authorization</span>
              </li>
            </ul>

            <a
              href="/merchant/register"
              className={styles.actionGreenBtn}
              onClick={(e) => {
                if (onGetStartedClick) {
                  e.preventDefault();
                  onGetStartedClick();
                }
              }}
            >
              <span>Get Started as a Merchant</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ─── 5. WHY ERECEIPT: 4 PILLARS ──────────────────────── */}
      <section id="about" className={styles.pillarsSection}>
        <div className={styles.pillarsContainer}>
          <div className={styles.pillarsLeftHeader}>
            <span className={styles.sectionPre}>WHY ERECEIPT?</span>
            <h2 className={styles.pillarsTitle}>Built for trust. Designed for impact.</h2>
            <p className={styles.pillarsDescription}>
              eReceipt is more than a digital receipt platform — it's a step toward a more transparent,
              efficient, and sustainable business ecosystem in Ethiopia. We make receipt access and record
              management easier for everyone, while supporting compliance and better tax reporting.
            </p>
            <a href="#learn-more" className={styles.learnMoreBtn}>
              <span>Learn More About Us</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* 4 Cards Grid */}
          <div className={styles.pillarsCardsGrid}>
            <div className={styles.pillarCard}>
              <div className={styles.pillarIconBadge}>🛡️</div>
              <h4>Verified Merchants</h4>
              <p>Merchant identity and business details are verified before full access is granted.</p>
            </div>
            <div className={styles.pillarCard}>
              <div className={styles.pillarIconBadge}>🔳</div>
              <h4>Authentic Receipts</h4>
              <p>Every receipt has a unique identifier and QR code for verification.</p>
            </div>
            <div className={styles.pillarCard}>
              <div className={styles.pillarIconBadge}>🔒</div>
              <h4>Data Privacy</h4>
              <p>Your information is protected with industry-standard security measures.</p>
            </div>
            <div className={styles.pillarCard}>
              <div className={styles.pillarIconBadge}>☁️</div>
              <h4>Secure Infrastructure</h4>
              <p>Reliable, scalable, and built for long-term growth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. NATIONAL VISION BANNER & TESTIMONIAL ─────────── */}
      <section className={styles.visionSection}>
        <div className={styles.visionContainer}>
          {/* Left Dark Emerald Banner with Addis Ababa Background */}
          <div className={styles.visionHeroCard}>
            <span className={styles.visionEyebrow}>A STRONGER DIGITAL ECONOMY</span>
            <h3 className={styles.visionHeading}>
              For a more transparent and efficient Ethiopia
            </h3>
            <p className={styles.visionText}>
              eReceipt helps businesses stay organized, empowers customers with easy access to their
              receipts, and supports a more transparent and accountable tax system.
            </p>

            <div className={styles.statsCountersRow}>
              <div className={styles.statBox}>
                <span className={styles.statMetric}>100%</span>
                <span className={styles.statLabel}>Digital receipts</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statMetric}>Less</span>
                <span className={styles.statLabel}>paper waste</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statMetric}>More</span>
                <span className={styles.statLabel}>organized records</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statMetric}>A fairer</span>
                <span className={styles.statLabel}>tax ecosystem</span>
              </div>
            </div>
          </div>

          {/* Right Customer Testimonial Card */}
          <div className={styles.testimonialCard}>
            <span className={styles.quoteMark}>“</span>
            <blockquote className={styles.quoteBody}>
              eReceipt makes it so easy to keep track of my purchases. I can quickly scan a QR code
              and view all the details. It gives me confidence and peace of mind.
            </blockquote>
            <div className={styles.authorRow}>
              <div className={styles.authorAvatar}>ST</div>
              <div>
                <strong className={styles.authorName}>Selam Tadesse</strong>
                <p className={styles.authorRole}>Customer</p>
              </div>
            </div>
            <div className={styles.carouselDots}>
              <span className={styles.dot}></span>
              <span className={`${styles.dot} ${styles.dotActive}`}></span>
              <span className={styles.dot}></span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. FOOTER ───────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerBrandCol}>
            <div className={styles.footerLogo}>
              <img
                src={logoWhiteImg}
                alt="eReceipt - Digital Receipts. A Stronger Ethiopia."
                className={styles.footerLogoImg}
              />
            </div>
            <p className={styles.footerTagline}>
              Digital receipts. Stronger businesses. <br />
              A brighter Ethiopia.
            </p>
          </div>

          <div className={styles.footerNavGroup}>
            <h4>For Customers</h4>
            <ul>
              <li><a href="/scan">Scan Receipt</a></li>
              <li><a href="/saved">Saved Receipts</a></li>
              <li><a href="/help">Help</a></li>
            </ul>
          </div>

          <div className={styles.footerNavGroup}>
            <h4>For Merchants</h4>
            <ul>
              <li>
                <a
                  href="/merchant/register"
                  onClick={(e) => {
                    if (onGetStartedClick) {
                      e.preventDefault();
                      onGetStartedClick();
                    }
                  }}
                >
                  Register Business
                </a>
              </li>
              <li>
                <a
                  href="/merchant/login"
                  onClick={(e) => {
                    if (onSignInClick) {
                      e.preventDefault();
                      onSignInClick();
                    }
                  }}
                >
                  Merchant Sign In
                </a>
              </li>
              <li><a href="/guide">Verification Guide</a></li>
            </ul>
          </div>

          <div className={styles.footerNavGroup}>
            <h4>Company</h4>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Ethiopian Tibeb Geometric Border Accent */}
        <div className={styles.footerBottomBar}>
          <div className={styles.footerBottomInner}>
            <p>© 2026 eReceipt. All rights reserved.</p>
            <div className={styles.socialLinks}>
              <a href="#fb" aria-label="Facebook">FB</a>
              <a href="#x" aria-label="X">𝕏</a>
              <a href="#in" aria-label="LinkedIn">IN</a>
              <a href="#yt" aria-label="YouTube">YT</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
"use client";
import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGlow}></div>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.brandSection}>
            <Link href="/" className={styles.logoLink}>
              <Image 
                src="/Screenshot 2024-11-22 023519.png"
                width={180}  // Adjusted for footer
                height={60}  // Adjusted for footer
                alt="NFT Marketplace"
                className={styles.logo}
              />
            </Link>
            <p className={styles.tagline}>
              Empowering artists and collectors in the digital age
            </p>
            <div className={styles.socialLinks}>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <i className="fab fa-x-twitter"></i>
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <i className="fab fa-discord"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <i className="fab fa-telegram"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          <div className={styles.linksSection}>
            <div className={styles.linkColumn}>
              <h3>Marketplace</h3>
              <Link href="/marketplace">Explore</Link>
              <Link href="/sellNFT">Create</Link>
              <Link href="/profile">My Items</Link>
            </div>

            <div className={styles.linkColumn}>
              <h3>Resources</h3>
              <Link href="/help">Help Center</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/newsletter">Newsletter</Link>
            </div>

            <div className={styles.linkColumn}>
              <h3>Company</h3>
              <Link href="/about">About Us</Link>
              <Link href="/careers">Careers</Link>
              <Link href="/contact">Contact Us</Link>
            </div>
          </div>
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.newsletter}>
            <h3>Stay in the loop</h3>
            <div className={styles.inputGroup}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className={styles.emailInput}
              />
              <button className={styles.subscribeBtn}>Subscribe</button>
            </div>
          </div>
        </div>

        <div className={styles.copyright}>
          <p>© 2024 NFT Marketplace. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Image from "next/image";
import Header from "./components/header/Header";
import styles from "./page.module.css";
import Footer from "./components/footer/Footer";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.backgroundImage}>
          <Image
            src="/nft-bg.jpg"
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            quality={100}
            priority
            alt="background"
          />
        </div>
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>
              Discover, Collect, and Trade Extraordinary NFTs
            </h1>
            <p className={styles.subtitle}>
              Step into the world of digital art and collectibles. Explore unique NFTs, 
              own authentic digital assets, and join a thriving community of creators and collectors.
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/marketplace" className={styles.primaryButton}>
                Explore NFTs
              </Link>
              <Link href="/sellNFT" className={styles.secondaryButton}>
                Create & Sell
              </Link>
              <Link href="/virtual-verse" className={styles.secondaryButton}>
                Virtual Verse
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.featuresSection}>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎨</div>
              <h3>Unique Digital Art</h3>
              <p>Discover one-of-a-kind digital masterpieces from talented artists worldwide</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔒</div>
              <h3>Secure Ownership</h3>
              <p>True ownership verified on the blockchain with smart contract technology</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💎</div>
              <h3>Easy Trading</h3>
              <p>Buy and sell NFTs seamlessly with just a few clicks</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

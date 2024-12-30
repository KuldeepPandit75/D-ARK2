"use client";
import { WalletContext } from "@/context/wallet";
import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import MarketplaceJson from "../marketplace.json";
import styles from "./profile.module.css";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import axios from "axios";
import NFTTile from "../components/nftCard/NFTCard";
import Link from "next/link";

export default function Profile() {
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState("0");
  const { isConnected, userAddress, signer } = useContext(WalletContext);

  async function getNFTitems() {
    try {
      let sumPrice = 0;
      const itemsArray = [];
      
      if (!signer) {
        return { itemsArray: [], sumPrice: 0 };
      }

      const contract = new ethers.Contract(
        MarketplaceJson.address,
        MarketplaceJson.abi,
        signer
      );

      const transaction = await contract.getMyNFTs();

      for (const i of transaction) {
        try {
          const tokenId = parseInt(i.tokenId);
          const tokenURI = await contract.tokenURI(tokenId);
          const meta = (await axios.get(tokenURI)).data;
          const price = ethers.formatEther(i.price);

          const item = {
            price,
            tokenId,
            seller: i.seller,
            owner: i.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
          };

          itemsArray.push(item);
          sumPrice += Number(price);
        } catch (err) {
          console.error(`Error processing NFT ${i.tokenId}:`, err);
          continue;
        }
      }
      return { itemsArray, sumPrice };
    } catch (error) {
      console.error("Error in getNFTitems:", error);
      return { itemsArray: [], sumPrice: 0 };
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isConnected || !signer) {
          setItems([]);
          setTotalPrice(0);
          return;
        }

        const result = await getNFTitems();
        if (result) {
          setItems(result.itemsArray);
          setTotalPrice(result.sumPrice);
        }
      } catch (error) {
        console.error("Error fetching NFT items:", error);
        setItems([]);
        setTotalPrice(0);
      }
    };

    fetchData();
  }, [isConnected, signer]);

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.innerContainer}>
          {isConnected ? (
            <div className={styles.content}>
              <div className={styles.profileHeader}>
                <h1 className={styles.heading}>My NFT Collection</h1>
                <div className={styles.userInfo}>
                  <span className={styles.label}>Wallet Address:</span>
                  <span className={styles.address}>{userAddress}</span>
                </div>
                <div className={styles.stats}>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Total NFTs</span>
                    <span className={styles.statValue}>{items?.length || 0}</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Portfolio Value</span>
                    <span className={styles.statValue}>{totalPrice} ETH</span>
                  </div>
                </div>
              </div>

              <div className={styles.nftSection}>
                {items?.length > 0 ? (
                  <div className={styles.nftGrid}>
                    {items.map((value, index) => (
                      <NFTTile 
                        item={value} 
                        key={index} 
                        isOwned={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyStateContent}>
                      <h2>No NFTs Found</h2>
                      <p>Start your collection by exploring our marketplace</p>
                      <Link href="/marketplace" className={styles.exploreButton}>
                        Explore NFTs
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.notConnectedState}>
              <div className={styles.notConnectedContent}>
                <h1>Connect Your Wallet</h1>
                <p>Connect your wallet to view your NFT collection and portfolio</p>
                <button 
                  onClick={() => document.querySelector('[class*="ctaBtn"]').click()} 
                  className={styles.connectButton}
                >
                  Connect Wallet
                </button>
                <div className={styles.featuresGrid}>
                  <div className={styles.feature}>
                    <h3>View Collection</h3>
                    <p>See all your NFTs in one place</p>
                  </div>
                  <div className={styles.feature}>
                    <h3>Track Value</h3>
                    <p>Monitor your portfolio growth</p>
                  </div>
                  <div className={styles.feature}>
                    <h3>Manage NFTs</h3>
                    <p>List and manage your digital assets</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

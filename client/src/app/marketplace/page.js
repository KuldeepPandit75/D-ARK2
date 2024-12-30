"use client";
import { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { WalletContext } from "@/context/wallet";
import MarketplaceJson from "../marketplace.json";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import NFTTile from "../components/nftCard/NFTCard";
import styles from "./marketplace.module.css";

export default function Marketplace() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { signer } = useContext(WalletContext);

  useEffect(() => {
    getAllNFTs();
  }, [signer]);

  const getAllNFTs = async () => {
    try {
      setLoading(true);
      if (!signer) {
        setLoading(false);
        return;
      }

      const contract = new ethers.Contract(
        MarketplaceJson.address,
        MarketplaceJson.abi,
        signer
      );

      let transaction = await contract.getAllListedNFTs();
      let items = await Promise.all(transaction.map(async (i) => {
        const tokenId = parseInt(i.tokenId);
        const tokenURI = await contract.tokenURI(tokenId);
        let meta = await axios.get(tokenURI);
        meta = meta.data;

        let price = ethers.formatEther(i.price);
        let item = {
          price,
          tokenId: tokenId,
          seller: i.seller,
          owner: i.owner,
          image: meta.image,
          name: meta.name,
          description: meta.description,
        };
        return item;
      }));

      setData(items);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.marketplaceHeader}>
          <div className={styles.content}>
            <h1 className={styles.title}>NFT Marketplace</h1>
            <p className={styles.subtitle}>
              Discover, collect, and trade extraordinary NFTs
            </p>
          </div>
        </div>

        <div className={styles.nftSection}>
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.loadingContent}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading NFTs...</p>
              </div>
            </div>
          ) : data.length > 0 ? (
            <>
              <div className={styles.sectionHeader}>
                <h2>Available NFTs</h2>
                <p>{data.length} items available</p>
              </div>
              <div className={styles.nftGrid}>
                {data.map((value, index) => (
                  <NFTTile key={index} item={value} />
                ))}
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateContent}>
                <h2>No NFTs Available</h2>
                <p>Be the first to list your NFT in the marketplace</p>
                <a href="/sellNFT" className={styles.createButton}>
                  Create NFT
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

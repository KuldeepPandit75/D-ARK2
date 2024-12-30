"use client";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import styles from "./NFTCard.module.css";
import { ethers } from "ethers";
import { useContext, useState } from "react";
import { WalletContext } from "@/context/wallet";
import MarketplaceJson from "../../marketplace.json";

export default function NFTTile({ item, isOwned }) {
  const router = useRouter();
  const { signer, isConnected, userAddress } = useContext(WalletContext);
  const [buying, setBuying] = useState(false);
  const imageUrl = item?.image || "/placeholder-nft.png";

  const buyNFT = async (e) => {
    e.stopPropagation(); // Prevent card click when clicking buy button
    try {
      if (!isConnected) {
        alert("Please connect your wallet first");
        return;
      }

      setBuying(true);
      const contract = new ethers.Contract(
        MarketplaceJson.address,
        MarketplaceJson.abi,
        signer
      );

      // Check network
      const network = await signer.provider.getNetwork();
      const chainID = network.chainId;
      const sepoliaNetworkId = "11155111";

      if (chainID.toString() !== sepoliaNetworkId) {
        alert("Please switch to Sepolia network");
        return;
      }

      const price = ethers.parseEther(item.price.toString());
      const transaction = await contract.executeSale(item.tokenId, {
        value: price
      });

      alert("Please wait while your transaction is being processed...");
      await transaction.wait();
      alert("You have successfully purchased the NFT!");
      router.push('/profile'); // Redirect to profile after purchase
    } catch (error) {
      console.error("Error buying NFT:", error);
      alert("Error buying NFT. Please check console for details.");
    } finally {
      setBuying(false);
    }
  };

  const handleCardClick = () => {
    router.push(`/nft/${item.tokenId}`);
  };

  return (
    <div className={styles.nftCard} onClick={handleCardClick}>
      <div className={styles.imageContainer}>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={item?.name || "NFT"}
            width={300}
            height={300}
            className={styles.image}
          />
        )}
        {isOwned && (
          <div className={styles.ownedBadge}>
            You own this NFT
          </div>
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{item?.name || "Untitled NFT"}</h3>
        <p className={styles.description}>
          {item?.description || "No description available"}
        </p>
        <p className={styles.price}>{item?.price || "0"} ETH</p>
        {!isOwned && (
          <button 
            onClick={buyNFT} 
            className={styles.buyButton}
            disabled={buying || !isConnected}
          >
            {buying ? "Processing..." : "Buy Now"}
          </button>
        )}
        {isOwned && (
          <div className={styles.ownerInfo}>
            Owner: {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
          </div>
        )}
      </div>
    </div>
  );
}

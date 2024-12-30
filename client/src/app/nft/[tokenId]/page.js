// "use client";
// import { useState, useEffect, useContext } from 'react';
// import { ethers } from 'ethers';
// import { WalletContext } from '@/context/wallet';
// import MarketplaceJson from '../../marketplace.json';
// import Image from 'next/image';
// import Header from '../../components/header/Header';
// import Footer from '../../components/footer/Footer';
// import styles from './nft.module.css';

// export default function NFTPage({ params }) {
//   const [nft, setNft] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [buying, setBuying] = useState(false);
//   const { isConnected, signer } = useContext(WalletContext);
//   const tokenId = params.tokenId;

//   useEffect(() => {
//     fetchNFTData();
//   }, [tokenId, signer]);

//   async function fetchNFTData() {
//     try {
//       if (!signer) return;

//       const contract = new ethers.Contract(
//         MarketplaceJson.address,
//         MarketplaceJson.abi,
//         signer
//       );

//       const tokenURI = await contract.tokenURI(tokenId);
//       const meta = await fetch(tokenURI).then(res => res.json());
//       const item = await contract.getListedTokenForId(tokenId);
      
//       setNft({
//         tokenId: tokenId,
//         name: meta.name,
//         description: meta.description,
//         image: meta.image,
//         price: ethers.formatEther(item.price),
//         seller: item.seller,
//         owner: item.owner
//       });
//     } catch (error) {
//       console.error("Error fetching NFT:", error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function buyNFT() {
//     try {
//       if (!isConnected) {
//         alert("Please connect your wallet first");
//         return;
//       }

//       setBuying(true);
//       const contract = new ethers.Contract(
//         MarketplaceJson.address,
//         MarketplaceJson.abi,
//         signer
//       );

//       const price = ethers.parseEther(nft.price.toString());
//       const transaction = await contract.executeSale(tokenId, {
//         value: price
//       });

//       await transaction.wait();
//       alert("You have successfully purchased the NFT!");
//       fetchNFTData(); // Refresh NFT data
//     } catch (error) {
//       console.error("Error buying NFT:", error);
//       alert("Error buying NFT. Please check console for details.");
//     } finally {
//       setBuying(false);
//     }
//   }

//   if (loading) {
//     return (
//       <div className={styles.container}>
//         <Header />
//         <div className={styles.loading}>Loading NFT details...</div>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className={styles.container}>
//       <Header />
//       <main className={styles.main}>
//         {nft ? (
//           <div className={styles.nftDetail}>
//             <div className={styles.imageSection}>
//               <Image
//                 src={nft.image}
//                 alt={nft.name}
//                 width={500}
//                 height={500}
//                 className={styles.nftImage}
//               />
//             </div>
//             <div className={styles.infoSection}>
//               <h1 className={styles.title}>{nft.name}</h1>
//               <p className={styles.description}>{nft.description}</p>
//               <div className={styles.priceSection}>
//                 <span className={styles.priceLabel}>Price:</span>
//                 <span className={styles.price}>{nft.price} ETH</span>
//               </div>
//               <div className={styles.details}>
//                 <p><strong>Token ID:</strong> {nft.tokenId}</p>
//                 <p><strong>Seller:</strong> {nft.seller}</p>
//                 <p><strong>Owner:</strong> {nft.owner}</p>
//               </div>
//               <button 
//                 className={styles.buyButton}
//                 onClick={buyNFT}
//                 disabled={buying || !isConnected}
//               >
//                 {buying ? "Processing..." : "Buy Now"}
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className={styles.error}>NFT not found</div>
//         )}
//       </main>
//       <Footer />
//     </div>
//   );
// }
"use client";
import { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { WalletContext } from '@/context/wallet';
import MarketplaceJson from '../../marketplace.json';
import Image from 'next/image';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import styles from './nft.module.css';
import { use } from 'react';

export default function NFTPage({ params }) {
  const [nft, setNft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const { isConnected, signer, userAddress } = useContext(WalletContext);
  const tokenId = params.tokenId;

  useEffect(() => {
    if (signer) {
      fetchNFTData();
    }
  }, [tokenId, signer]);

  async function fetchNFTData() {
    try {
      if (!signer) return;

      const contract = new ethers.Contract(
        MarketplaceJson.address,
        MarketplaceJson.abi,
        signer
      );

      // Get NFT listing details
      const listing = await contract.getNFTListing(tokenId);
      const tokenURI = await contract.tokenURI(tokenId);
      const meta = await fetch(tokenURI).then(res => res.json());
      
      setNft({
        tokenId: tokenId,
        name: meta.name,
        description: meta.description,
        image: meta.image,
        price: ethers.formatEther(listing.price),
        seller: listing.seller,
        owner: listing.owner
      });
    } catch (error) {
      console.error("Error fetching NFT:", error);
    } finally {
      setLoading(false);
    }
  }

  async function buyNFT() {
    try {
        if (!isConnected) {
            alert("Please connect your wallet first");
            return;
        }

        setBuying(true);
        const buyerAddress = await signer.getAddress();
        const provider = new ethers.BrowserProvider(window.ethereum);

        // Get fee data instead of gas price
        const feeData = await provider.getFeeData();
        
        console.log("Transaction Details:", {
            buyerAddress,
            sellerAddress: nft.seller,
            tokenId: tokenId,
            price: nft.price
        });

        const contract = new ethers.Contract(
            MarketplaceJson.address,
            MarketplaceJson.abi,
            signer
        );

        const price = ethers.parseEther(nft.price.toString());

        // Log execution parameters
        console.log("Executing sale with parameters:", {
            tokenId: tokenId,
            value: price.toString(),
            gasPrice: feeData.gasPrice?.toString(),
            contractAddress: MarketplaceJson.address,
            buyerAddress: buyerAddress,
            sellerAddress: nft.seller
        });

        const tx = await contract.executeSale(tokenId, {
            value: price,
            gasLimit: 500000,
            maxFeePerGas: feeData.maxFeePerGas,
            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
        });

        console.log("Transaction sent:", tx.hash);
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);

        alert("You have successfully purchased the NFT!");
        await fetchNFTData();
    } catch (error) {
        console.error("Full error details:", {
            message: error.message,
            code: error.code,
            data: error?.data,
            transaction: error?.transaction
        });

        if (error.message.includes("insufficient funds")) {
            alert("Insufficient funds for gas and NFT price");
        } else if (error.message.includes("user rejected")) {
            alert("Transaction was rejected");
        } else if (error.message.includes("execution reverted")) {
            alert("Transaction failed. The NFT might already be sold or the price has changed.");
        } else {
            alert("Transaction failed. Please try again and ensure you have enough tokens for gas fees.");
        }
    } finally {
        setBuying(false);
    }
}





  // Add this function to check if user can buy
  function canUserBuy() {
    if (!isConnected || !userAddress || !nft) return false;
    return nft.seller.toLowerCase() !== userAddress.toLowerCase();
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.loading}>Loading NFT details...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        {nft ? (
          <div className={styles.nftDetail}>
            <div className={styles.imageSection}>
              <Image
                src={nft.image}
                alt={nft.name}
                width={500}
                height={500}
                className={styles.nftImage}
                unoptimized
              />
            </div>
            <div className={styles.infoSection}>
              <h1 className={styles.title}>{nft.name}</h1>
              <p className={styles.description}>{nft.description}</p>
              <div className={styles.priceSection}>
                <span className={styles.priceLabel}>Price:</span>
                <span className={styles.price}>{nft.price} ETH</span>
              </div>
              <div className={styles.details}>
                <p><strong>Token ID:</strong> {nft.tokenId}</p>
                <p><strong>Seller:</strong> {nft.seller}</p>
                <p><strong>Owner:</strong> {nft.owner}</p>
              </div>
              <button 
                className={styles.buyButton}
                onClick={buyNFT}
                disabled={buying || !canUserBuy()}
              >
                {buying ? "Processing..." : 
                 !isConnected ? "Connect Wallet" :
                 nft.seller.toLowerCase() === userAddress.toLowerCase() ? "You Own This NFT" :
                 "Buy Now"}
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.error}>NFT not found</div>
        )}
      </main>
      <Footer />
    </div>
  );
}


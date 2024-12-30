// import { WalletContext } from "@/context/wallet";
// import { BrowserProvider } from "ethers";
// import Image from "next/image";
// import Link from "next/link";
// import { useContext, React } from "react";
// import styles from "./Header.module.css";

// export default function Header() {
//   const {
//     isConnected,
//     setIsConnected,
//     userAddress,
//     setUserAddress,
//     signer,
//     setSigner,
//   } = useContext(WalletContext);

//   const connectWallet = async () => {
//     if (!window.ethereum) {
//       throw new Error("Metamask is not installed");
//     }

//     try {
//       const provider = new BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       setSigner(signer);
//       const accounts = await provider.send("eth_requestAccounts", []);
//       setIsConnected(true);
//       setUserAddress(accounts[0]);
//       const network = await provider.getNetwork();
//       const chainID = network.chainId;
//       const sepoliaNetworkId = "11155111";

//       if (chainID.toString() !== sepoliaNetworkId) {
//         alert("Please switch your MetaMask to sepolia network");
//         return;
//       }
//     } catch (error) {
//       console.error("connection error: ", error);
//     }
//   };

//   return (
//     <header className={styles.header}>
//       <div className={styles.headerGlow}></div>
//       <div className={styles.container}>
//         <div className={styles.logo}>
//           <Link href="/">
//             <Image 
//               src="/Screenshot 2024-11-22 023519.png"
//               width={200}
//               height={65}
//               alt="NFT Marketplace"
//               priority
//               className={styles.logoImage}
//             />
//           </Link>
//         </div>
//         <nav className={styles.nav}>
//           <ul className={styles.navLinks}>
//             <li>
//               <Link href="/marketplace" className={styles.link}>
//                 Discover
//               </Link>
//             </li>
//             <li>
//               <Link href="/sellNFT" className={styles.link}>
//                 Mint NFT
//               </Link>
//             </li>
//             <li>
//               <Link href="/profile" className={styles.link}>
//                 Gallery
//               </Link>
//             </li>
//           </ul>
//           <button
//             className={`${styles.ctaBtn} ${
//               isConnected ? styles.activebtn : styles.inactivebtn
//             }`}
//             onClick={connectWallet}
//           >
//             {isConnected ? (
//               <>{userAddress?.slice(0, 8)}...</>
//             ) : (
//               "Connect Wallet"
//             )}
//           </button>
//         </nav>
//       </div>
//     </header>
//   );
// }


"use client";
import { WalletContext } from "@/context/wallet";
import { BrowserProvider } from "ethers";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import styles from "./Header.module.css";

export default function Header() {
  const {
    isConnected,
    setIsConnected,
    userAddress,
    setUserAddress,
    signer,
    setSigner,
  } = useContext(WalletContext);

  const connectWallet = async () => {
    if (!window.ethereum) {
      throw new Error("Metamask is not installed");
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setSigner(signer);
      const accounts = await provider.send("eth_requestAccounts", []);
      setIsConnected(true);
      setUserAddress(accounts[0]);
      const network = await provider.getNetwork();
      const chainID = network.chainId;
      const sepoliaNetworkId = "11155111";

      if (chainID.toString() !== sepoliaNetworkId) {
        alert("Please switch your MetaMask to sepolia network");
        return;
      }
    } catch (error) {
      console.error("connection error: ", error);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerGlow}></div>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
            <Image 
              src="/Screenshot 2024-11-22 023519.png"
              width={200}
              height={65}
              alt="NFT Marketplace"
              priority
              className={styles.logoImage}
            />
          </Link>
        </div>
        <nav className={styles.nav}>
          <ul className={styles.navLinks}>
            <li>
              <Link href="/marketplace" className={styles.link}>
                Discover
              </Link>
            </li>
            <li>
              <Link href="/sellNFT" className={styles.link}>
                Mint NFT
              </Link>
            </li>
            <li>
              <Link href="/profile" className={styles.link}>
                Gallery
              </Link>
            </li>
          </ul>
          <button
            className={`${styles.ctaBtn} ${
              isConnected ? styles.activebtn : styles.inactivebtn
            }`}
            onClick={connectWallet}
          >
            {isConnected ? (
              <>{userAddress?.slice(0, 8)}...</>
            ) : (
              "Connect Wallet"
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}

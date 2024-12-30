"use client";
import { useState, useContext } from "react";
import { ethers } from "ethers";
import { WalletContext } from "@/context/wallet";
import axios from "axios";
import MarketplaceJson from "../marketplace.json";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import styles from "./sellNFT.module.css";
import Image from "next/image";
import { getContract, verifyNetwork } from "@/utils/web3"; 



export default function SellNFT() {
  const [formInput, setFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const [fileURL, setFileURL] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const { signer, isConnected } = useContext(WalletContext);

  async function uploadFile(e) {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      const ImgHash = `https://ipfs.io/ipfs/${resFile.data.IpfsHash}`;
      setFileURL(ImgHash);
      return ImgHash;
    } catch (error) {
      console.error("Error uploading file: ", error);
      alert("Error uploading file to IPFS");
    } finally {
      setIsUploading(false);
    }
  }

  async function listNFT(e) {
    e.preventDefault();
    if (!isConnected) {
        alert("Please connect your wallet first");
        return;
    }

    if (!fileURL || !formInput.name || !formInput.description || !formInput.price) {
        alert("Please fill all the fields");
        return;
    }

    try {
        setIsMinting(true);
        
        // Verify network first
        await verifyNetwork();
        
        // Get contract instance
        const contract = await getContract(signer);

        const nftJSON = {
            name: formInput.name,
            description: formInput.description,
            image: fileURL,
        };

        const response = await axios({
            method: "post",
            url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
            data: JSON.stringify(nftJSON),
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
                'Content-Type': 'application/json'
            },
        });

        const tokenURI = `https://ipfs.io/ipfs/${response.data.IpfsHash}`;
        const price = ethers.parseEther(formInput.price);
        
        console.log("Creating token with:", {
            tokenURI,
            price: price.toString(),
            contractAddress: MarketplaceJson.address
        });

        const transaction = await contract.createToken(tokenURI, price);
        console.log("Transaction hash:", transaction.hash);
        
        const receipt = await transaction.wait();
        console.log("Transaction confirmed:", receipt);

        alert("Successfully listed your NFT!");
        setFormInput({ name: "", description: "", price: "" });
        setFileURL(null);
    } catch (error) {
        console.error("Detailed Error:", error);
        alert(`Error: ${error.message}`);
    } finally {
        setIsMinting(false);
    }
}




  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.mintHeader}>
          <h1 className={styles.title}>Create New NFT</h1>
          <p className={styles.subtitle}>
            Create and list your unique digital assets
          </p>
        </div>

        <div className={styles.formContainer}>
          <form onSubmit={listNFT} className={styles.form}>
            <div className={styles.uploadSection}>
              <div className={styles.uploadArea}>
                {fileURL ? (
                  <div className={styles.previewContainer}>
                    <Image
                      src={fileURL}
                      alt="NFT Preview"
                      width={300}
                      height={300}
                      className={styles.preview}
                      unoptimized
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />
                  </div>
                ) : (
                  <label className={styles.uploadLabel}>
                    <input
                      type="file"
                      onChange={uploadFile}
                      className={styles.fileInput}
                      disabled={isUploading || !isConnected}
                    />
                    <div className={styles.uploadContent}>
                      <i className="fas fa-upload"></i>
                      <span>
                        {isUploading ? "Uploading..." : "Click to upload image"}
                      </span>
                    </div>
                  </label>
                )}
              </div>
            </div>

            <div className={styles.formFields}>
              <div className={styles.inputGroup}>
                <label>Name</label>
                <input
                  type="text"
                  placeholder="NFT Name"
                  onChange={(e) =>
                    setFormInput({ ...formInput, name: e.target.value })
                  }
                  value={formInput.name}
                  className={styles.input}
                  disabled={!isConnected}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Description</label>
                <textarea
                  placeholder="NFT Description"
                  onChange={(e) =>
                    setFormInput({ ...formInput, description: e.target.value })
                  }
                  value={formInput.description}
                  className={styles.textarea}
                  disabled={!isConnected}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Price (ETH)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="NFT Price in ETH"
                  onChange={(e) =>
                    setFormInput({ ...formInput, price: e.target.value })
                  }
                  value={formInput.price}
                  className={styles.input}
                  disabled={!isConnected}
                />
              </div>

              <button
                type="submit"
                className={styles.mintButton}
                disabled={isMinting || !isConnected}
              >
                {isMinting ? "Creating NFT..." : "Create NFT"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

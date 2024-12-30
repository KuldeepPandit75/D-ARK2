import { ethers } from 'ethers';
import MarketplaceJson from '@/app/marketplace.json';

export const verifyNetwork = async () => {
    if (!window.ethereum) throw new Error("MetaMask not installed");
    
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    console.log("Current Chain ID:", chainId);
    
    // Convert decimal chainId to hex format
    const targetChainIdHex = `0x${(656476).toString(16)}`;
    
    // Correct Open Campus Testnet configuration
    const networkConfig = {
        chainId: targetChainIdHex,
        chainName: 'EDU Chain Testnet',
        nativeCurrency: {
            name: 'EDU',
            symbol: '$EDU',
            decimals: 18
        },
        rpcUrls: ['https://open-campus-codex-sepolia.drpc.org'],
        blockExplorerUrls: ['https://explorer.edu-chain.gelato.digital']
    };
    
    if (chainId !== targetChainIdHex) {
        try {
            // Try to switch to the network first
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: targetChainIdHex }],
            });
        } catch (error) {
            if (error.code === 4902) {
                // Network doesn't exist, add it
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [networkConfig],
                    });
                } catch (addError) {
                    console.error("Failed to add network:", addError);
                    throw new Error("Please add Codex network to MetaMask manually");
                }
            } else {
                console.error("Failed to switch network:", error);
                throw new Error("Please switch to Codex network in MetaMask");
            }
        }
    }
};

export const getContract = async (signer) => {
    try {
        await verifyNetwork();
        
        // Verify that we have a valid signer
        if (!signer) {
            throw new Error("No signer provided");
        }
        
        // Verify that we have valid contract information
        if (!MarketplaceJson.address || !MarketplaceJson.abi) {
            throw new Error("Invalid contract configuration");
        }
        
        const contract = new ethers.Contract(
            MarketplaceJson.address,
            MarketplaceJson.abi,
            signer
        );
        return contract;
    } catch (error) {
        console.error("Error getting contract:", error);
        throw error;
    }
};
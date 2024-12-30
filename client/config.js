export const config = {
    MARKETPLACE_ADDRESS: "YOUR_DEPLOYED_CONTRACT_ADDRESS", // The address from Remix deployment
    RPC_URL: process.env.NEXT_PUBLIC_RPC_URL,
    CHAIN_ID: "0x3E7", // Educhain chain ID
    PINATA: {
        API_KEY: process.env.NEXT_PUBLIC_PINATA_API_KEY,
        SECRET_KEY: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
        JWT: process.env.NEXT_PUBLIC_JWT
    }
};

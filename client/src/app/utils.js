export default function GetIpfsUrlFromPinata(pinataUrl) {
  let IPFSUrl = pinataUrl.split("/");
  const lastIndex = IPFSUrl.length;
  IPFSUrl = "https://ipfs.io/ipfs/" + IPFSUrl[lastIndex - 1];
  return IPFSUrl;
}

// Add this function to handle multiple IPFS gateways
const IPFS_GATEWAYS = [
  "https://gateway.pinata.cloud/ipfs/",
  "https://ipfs.io/ipfs/",
  "https://gateway.ipfs.io/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/"
];

export const getIPFSUrl = (hash) => {
  if (!hash) return '';
  if (hash.startsWith('ipfs://')) {
    hash = hash.replace('ipfs://', '');
  }
  if (hash.startsWith('https://')) {
    return hash;
  }
  return `${IPFS_GATEWAYS[0]}${hash}`;
};

// Add a fallback image loading function
export const loadImageWithFallback = async (ipfsHash) => {
  for (const gateway of IPFS_GATEWAYS) {
    try {
      const url = `${gateway}${ipfsHash}`;
      const response = await fetch(url);
      if (response.ok) {
        return url;
      }
    } catch (error) {
      console.log(`Failed to load from gateway: ${gateway}`);
    }
  }
  return '/placeholder.png'; // Return a placeholder image if all gateways fail
};

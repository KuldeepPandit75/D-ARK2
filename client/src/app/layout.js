// import { Inter } from "next/font/google";
// import "./globals.css";
// import { WalletContextProvider } from "@/context/wallet";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "RYPTO",
//   description: "Discover, collect, and trade extraordinary NFTs",
//   icons: {
//     icon: '/Screenshot 2024-11-22 023519.png',
//   },
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <head>
//         <link 
//           rel="stylesheet" 
//           href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
//         />
//         <link 
//           rel="icon" 
//           href="/Screenshot 2024-11-22 023519.png" 
//           type="image/png"
//         />
//       </head>
//       <WalletContextProvider>
//         <body className={inter.className}>{children}</body>
//       </WalletContextProvider>
//     </html>
//   );
// }


import { Inter } from "next/font/google";
import "./globals.css";
import { WalletContextProvider } from "@/context/wallet";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Rypto",
  description: "Discover, collect, and trade extraordinary NFTs",
  icons: {
    icon: '/Screenshot 2024-11-22 023519.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
        />
        <link 
          rel="icon" 
          href="/Screenshot 2024-11-22 023519.png" 
          type="image/png"
        />
      </head>
      <WalletContextProvider>
        <body className={inter.className}>{children}</body>
      </WalletContextProvider>
    </html>
  );
}

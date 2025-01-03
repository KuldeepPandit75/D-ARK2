"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const GameApp = dynamic(
  () => import('../components/meta/Meta.jsx'),
  { 
    ssr: false,
    loading: () => <div>Loading game...</div>
  }
);

export default function GameWrapper() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initialize any game requirements here
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return <div>Loading game environment...</div>;
  }

  return <GameApp />;
}

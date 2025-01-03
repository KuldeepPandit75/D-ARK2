"use client";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Provider } from 'react-redux';
import store from '../store.js';

// Custom error boundary component
function ErrorFallback({ error }) {
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>Something went wrong:</h2>
            <pre style={{ color: 'red' }}>{error.message}</pre>
        </div>
    );
}

// Loading component
function LoadingFallback() {
    return (
        <div style={{ 
            width: '100%', 
            height: '100vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
        }}>
            <div>Loading game environment...</div>
        </div>
    );
}

// Dynamically import the game component
const GameApp = dynamic(
    () => import('../components/meta/Meta.jsx').catch(err => {
        console.error("Failed to load game:", err);
        return () => <ErrorFallback error={err} />;
    }),
    { 
        ssr: false,
        loading: () => <LoadingFallback />
    }
);

export default function VirtualVersePage() {
    return (
        <Provider store={store}>

        <Suspense fallback={<LoadingFallback />}>
            <div style={{ width: '100vw', height: '100vh' }}>
                <GameApp />
            </div>
        </Suspense>
        </Provider>
    );
}

// "use client";
// import { useState, useEffect } from 'react';
// import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
// import Meta from "./components/meta/Meta.jsx";
// import { Provider } from "react-redux";
// import store from './app/store.js';

// // Error boundary component
// function ErrorBoundary() {
//     return (
//         <div style={{ padding: '20px', textAlign: 'center' }}>
//             <h2>Oops! Something went wrong</h2>
//             <button onClick={() => window.location.reload()}>
//                 Try again
//             </button>
//         </div>
//     );
// }

// function App() {
//     const [mounted, setMounted] = useState(false);

//     useEffect(() => {
//         setMounted(true);
//     }, []);

//     if (!mounted) {
//         return <div>Initializing...</div>;
//     }

//     const router = createBrowserRouter(
//         createRoutesFromElements(
//             <Route 
//                 path='/' 
//                 element={<Meta />}
//                 errorElement={<ErrorBoundary />}
//             />
//         )
//     );

//     return (
//         <Provider store={store}>
//             <RouterProvider router={router} fallbackElement={<div>Loading...</div>} />
//         </Provider>
//     );
// }

// export default App;

"use client";
import { useState, useEffect } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Meta from "./components/meta/Meta.jsx";
import { Provider } from "react-redux";
import store from './app/store.js';

function App() {
    const [router, setRouter] = useState(null);

    useEffect(() => {
        // Create router with base URL matching Next.js route
        const browserRouter = createBrowserRouter([
            {
                path: "/virtual-verse/*",  // Match any path under virtual-verse
                element: <Meta />
            },
            {
                path: "/",  // Also match root path
                element: <Meta />
            }
        ]);
        
        setRouter(browserRouter);
    }, []);

    if (!router) {
        return <div>Loading game environment...</div>;
    }

    return (
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    );
}

export default App;

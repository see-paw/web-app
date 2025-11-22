import router from "./routes/routes.tsx";
import {RouterProvider} from "react-router-dom"
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/lib/queryClient";
import {Toaster} from "react-hot-toast";
import {faPaw} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

/**
 * Root application component.
 *
 * This component sets up the global context providers used across the application:
 *
 * **QueryClientProvider** – Supplies the TanStack Query client,
 *     enabling data fetching, caching, background updates, and
 *     server-state synchronization throughout the React component tree.
 *
 * **RouterProvider** – Provides the React Router instance that
 *     manages all client-side navigation, route loaders, actions,
 *     and error boundaries.
 *
 * @returns {JSX.Element} The root application element containing global providers.
 */
function App() {
    return (<QueryClientProvider client={queryClient}>
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 4000,
                style: {
                    background: '#fff',
                    color: '#171717',
                    borderRadius: '0.5rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                },
                success: {
                    icon: <FontAwesomeIcon icon={faPaw} style={{ color: '#ff5a7a' }} />,
                },
                error: {
                    iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                    },
                },
            }}
        />
        <RouterProvider router={router}/>
    </QueryClientProvider>)
}

export default App

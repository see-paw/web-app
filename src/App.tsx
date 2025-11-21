import router from "./routes/routes.tsx";
import {RouterProvider} from "react-router-dom"
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/lib/queryClient";

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
        <RouterProvider router={router}/>
    </QueryClientProvider>)
}

export default App

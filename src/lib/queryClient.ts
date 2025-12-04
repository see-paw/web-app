import { QueryClient } from "@tanstack/react-query";

/**
 * TanStack Query client instance with default configuration
 * 
 * Configuration:
 * - staleTime: 5 minutes
 * - retry: 1 attempt
 * - refetchOnWindowFocus: disabled
 * 
 * @constant
 * @type {QueryClient}
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutos
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

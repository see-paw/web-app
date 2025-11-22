import type {AuthTokens, User} from "@/types/user";
import {persist} from "zustand/middleware";
import {create} from "zustand/react";

/**
 * Authentication store state interface
 * 
 * @typedef {Object} AuthState
 * @property {User | null} user - Current authenticated user data
 * @property {AuthTokens | null} tokens - Authentication tokens (access and refresh)
 * @property {Function} isAuthenticated - Checks if user has valid tokens
 * @property {Function} setUser - Sets the current user
 * @property {Function} setTokens - Sets authentication tokens
 * @property {Function} logout - Clears user data and tokens
 */
interface AuthState {
    user: User | null
    tokens: AuthTokens | null
    isAuthenticated: () => boolean
    setUser: (user: User) => void
    setTokens: (tokens: AuthTokens) => void
    logout: () => void
}

/**
 * Zustand store for authentication state management
 * Persists authentication data to localStorage
 */
export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            tokens: null,
            isAuthenticated: () => !!get().tokens,
            setUser: (user) =>  set({user}),
            setTokens: (tokens) => set({tokens}),
            logout: () => set({ user: null, tokens: null }),
        }),
        { name: "seepaw-auth" }
    )
)

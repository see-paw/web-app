import type {AuthTokens, User} from "@/types/user";
import {persist} from "zustand/middleware/persist";
import {create} from "zustand/react";

interface AuthState {
    user: User | null
    tokens: AuthTokens | null
    isAuthenticated: () => boolean
    setUser: (user: User) => void
    setTokens: (tokens: AuthTokens) => void
    logout: () => void
}

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
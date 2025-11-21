import {createStore} from "zustand/vanilla";
import type {AuthResponse, User} from "@/types/user";

type AuthState = {
    user: User | null
    tokens: AuthResponse | null
    login: (data: { user: User; tokens: AuthResponse }) => void
    logout: () => void
}

export const useAuthStore = createStore<AuthState>((set) =>({
    user: null,
    tokens: null,
    login: ({ user, tokens }) => set({ user, tokens }),
    logout: () => set({ user: null, tokens: null }),
}))
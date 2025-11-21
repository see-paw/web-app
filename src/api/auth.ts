import {api} from "@/api/api";
import type {AuthResponse, UserProfile} from "@/types/user";

export interface LoginCredentials {
    email: string;
    password: string;
}

const authApi = {

    login: async function (loginCredentials: LoginCredentials, signal: AbortSignal): Promise<AuthResponse> {
        const { data: authResponse } = await api.post<AuthResponse>("/login", loginCredentials, { signal })

        return authResponse;
    },

    getUserId: async function (signal: AbortSignal): Promise<string> {
        const { data: userId } = await api.get<string>("/users/id", { signal })

        return userId;
    },

    getUserRole: async function (signal: AbortSignal): Promise<string> {
        const { data: role } = await api.get<string>("/users/role", { signal })

        return role;
    },

    getUserProfile: async function (signal: AbortSignal): Promise<UserProfile> {
        const {data: profile} = await api.get<UserProfile>("/users", { signal })

        return profile;
    }
}

export default authApi
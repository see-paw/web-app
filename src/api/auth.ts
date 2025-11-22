import {api} from "@/api/api";
import type {LoginResponse, UserData, UserProfile} from "@/types/user";
import type {LoginCredentials} from "@/pages/Auth/Login/Login";

const authApi = {

    login: async function (loginCredentials: LoginCredentials): Promise<LoginResponse> {
        const { data: authResponse } = await api.post<LoginResponse>("/login", loginCredentials)

        return authResponse;
    },

    getCurrentUserData: async function (signal: AbortSignal): Promise<UserData> {
        const { data: userData } = await api.get<UserData>("/users/me", { signal })

        return userData;
    },

    getUserProfile: async function (signal: AbortSignal): Promise<UserProfile> {
        const {data: profile} = await api.get<UserProfile>("/users", { signal })

        return profile;
    }
}

export default authApi
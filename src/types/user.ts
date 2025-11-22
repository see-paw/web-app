export const UserRole = {
    User: "User",
    AdminCAA: "AdminCAA"
}

export type UserRole =
    typeof UserRole[keyof typeof UserRole];

export interface LoginResponse {
    tokenType: string
    accessToken: string
    expiresIn: number
    refreshToken: string
}

export interface UserProfile {
    name: string
    birthDate: string
    street: string
    city: string
    postalCode: string
    phoneNumber: string
}

export interface UserData {
    userId: string
    email: string
    name: string
    role: UserRole
    shelterId: string | null
    birthDate: string
    street: string
    city: string
    postalCode: string
    phoneNumber: string
}


export interface User {
    userId: string,
    role: UserRole,
    email: string,
    shelterId: string | null,
    profile: UserProfile
}

export interface AuthTokens {
    accessToken: string
    refreshToken: string
}

export const UserRole = {
    User: "User",
    AdminCAA: "AdminCAA"
}

export type UserRole =
    typeof UserRole[keyof typeof UserRole];

export interface AuthResponse {
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

export interface User {
    userId: string,
    role: UserRole
    profile: UserProfile
}

export interface AuthUser {
    user: User,
    tokens: AuthTokens
}

export interface AuthTokens {
    accessToken: string
    refreshToken: string
}

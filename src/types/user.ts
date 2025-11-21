export interface AuthResponse {
    tokenType: string
    accessToken: string
    expiresIn: number
    refreshToken: string
}

export interface UserId {
    userId: string
}

export interface UserRole {
    role: string
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
    role: string
    profile: UserProfile
}

export interface AuthTokens {
    accessToken: string
    refreshToken: string
}

/**
 * User role constants
 */
export const UserRole = {
    User: "User",
    AdminCAA: "AdminCAA"
}

/**
 * User role type union
 */
export type UserRole =
    typeof UserRole[keyof typeof UserRole];

/**
 * Authentication response from login endpoint
 * 
 * @typedef {Object} LoginResponse
 * @property {string} tokenType - Token type (e.g., "Bearer")
 * @property {string} accessToken - JWT access token
 * @property {number} expiresIn - Token expiration time in seconds
 * @property {string} refreshToken - JWT refresh token
 */
export interface LoginResponse {
    tokenType: string
    accessToken: string
    expiresIn: number
    refreshToken: string
}

/**
 * User profile information
 * 
 * @typedef {Object} UserProfile
 * @property {string} name - User's full name
 * @property {string} birthDate - User's birth date (ISO format)
 * @property {string} street - Street address
 * @property {string} city - City name
 * @property {string} postalCode - Postal code
 * @property {string} phoneNumber - Contact phone number
 */
export interface UserProfile {
    name: string
    birthDate: string
    street: string
    city: string
    postalCode: string
    phoneNumber: string
}

/**
 * Complete user data from API
 * 
 * @typedef {Object} UserData
 * @property {string} userId - Unique user identifier
 * @property {string} email - User's email address
 * @property {string} name - User's full name
 * @property {UserRole} role - User's role (User or AdminCAA)
 * @property {string | null} shelterId - Associated shelter ID (null for regular users)
 * @property {string | null} shelterName - Associated shelter Name (null for regular users)
 * @property {string} birthDate - Birth date (ISO format)
 * @property {string} street - Street address
 * @property {string} city - City name
 * @property {string} postalCode - Postal code
 * @property {string} phoneNumber - Contact phone number
 */
export interface UserData {
    userId: string
    email: string
    name: string
    role: UserRole
    shelterId: string | null
    shelterName: string | null
    birthDate: string
    street: string
    city: string
    postalCode: string
    phoneNumber: string
}

/**
 * User object stored in application state
 * 
 * @typedef {Object} User
 * @property {string} userId - Unique user identifier
 * @property {UserRole} role - User's role
 * @property {string} email - User's email address
 * @property {string | null} shelterId - Associated shelter ID
 * @property {UserProfile} profile - User's profile information
 */
export interface User {
    userId: string,
    role: UserRole,
    email: string,
    shelterId: string | null,
    shelterName: string | null,
    profile: UserProfile
}

/**
 * Authentication tokens
 * 
 * @typedef {Object} AuthTokens
 * @property {string} accessToken - JWT access token
 * @property {string} refreshToken - JWT refresh token
 */
export interface AuthTokens {
    accessToken: string
    refreshToken: string
}

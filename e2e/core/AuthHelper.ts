// e2e/core/AuthHelper.ts
import { Page } from '@playwright/test';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthUser {
    userId: string;
    email: string;
    role: string;
    name: string;
    birthDate: string;
    street: string;
    city: string;
    postalCode: string;
    phoneNumber: string;
    shelterId: string | null;
    shelterName: string | null;
}

export interface AuthResponse {
    user: AuthUser;
    tokens: AuthTokens;
}

interface LoginApiResponse {
    tokenType: string;
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
}

/**
 * Performs real login via API and returns auth data
 * Makes 2 API calls:
 * 1. POST /api/auth/login - get tokens
 * 2. GET /api/users/me - get user data
 */
export async function performRealLogin(
    page: Page,
    credentials: LoginCredentials
): Promise<AuthResponse> {
    const apiUrl = process.env.VITE_API_URL || 'https://localhost:5001';

    // Step 1: Login to get tokens
    const loginResponse = await page.request.post(`${apiUrl}/api/login`, {
        data: {
            email: credentials.email,
            password: credentials.password
        },
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!loginResponse.ok()) {
        const errorBody = await loginResponse.text();
        throw new Error(`Login failed with status ${loginResponse.status()}: ${errorBody}`);
    }

    const loginData: LoginApiResponse = await loginResponse.json();

    // Validate login response structure
    if (!loginData.accessToken || !loginData.refreshToken) {
        throw new Error('Invalid login response: missing tokens');
    }


    // Step 2: Get user data using the access token
    const userResponse = await page.request.get(`${apiUrl}/api/users/me`, {
        headers: {
            'Authorization': `Bearer ${loginData.accessToken}`,
            'Content-Type': 'application/json'
        }
    });

    if (!userResponse.ok()) {
        const errorBody = await userResponse.text();
        throw new Error(`Get user failed with status ${userResponse.status()}: ${errorBody}`);
    }

    const userData: AuthUser = await userResponse.json();

    // Validate user response structure
    if (!userData.userId || !userData.email || !userData.role) {
        throw new Error('Invalid user response: missing required fields');
    }


    // Combine into the expected structure
    return {
        tokens: {
            accessToken: loginData.accessToken,
            refreshToken: loginData.refreshToken
        },
        user: userData
    };
}

/**
 * Sets auth data in localStorage (same structure as your Zustand store)
 */
export async function setAuthInLocalStorage(page: Page, authData: AuthResponse) {
    await page.addInitScript((data) => {
        const authStorage = {
            state: {
                user: data.user,
                tokens: data.tokens
            },
            version: 0
        };
        localStorage.setItem('seepaw-auth', JSON.stringify(authStorage));
    }, authData);
}
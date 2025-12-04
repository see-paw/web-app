import type { LoginResponse, UserData } from "@/types/user";

export const mockLoginResponse: LoginResponse = {
    tokenType: "Bearer",
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTAwMSIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsInJvbGUiOiJVc2VyIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjJ9.mockAccessTokenSignature123",
    expiresIn: 3600,
    refreshToken: "mockRefreshToken987654321abcdefghijklmnopqrstuvwxyz"
};

export const mockUserDataRegular: UserData = {
    userId: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    email: "user@example.com",
    role: "User",
    name: "João Silva",
    birthDate: "1990-05-15T00:00:00",
    street: "Rua das Flores, 123",
    city: "Porto",
    postalCode: "4000-001",
    phoneNumber: "912345678",
    shelterId: null,
    shelterName: null
};

export const mockUserDataAdminCAA: UserData = {
    userId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    email: "admin@shelter.com",
    role: "AdminCAA",
    name: "Maria Santos",
    birthDate: "1985-03-20T00:00:00",
    street: "Avenida Central, 456",
    city: "Lisboa",
    postalCode: "1000-001",
    phoneNumber: "918765432",
    shelterId: "11111111-1111-1111-1111-111111111111",
    shelterName: "Test Shelter"
};


export const validCredentials = {
    email: "diana@test.com",
    password: "Pa$$w0rd"
};

export const validCredentialsAdminCAA = {
    email: "alice@test.com",
    password: "Pa$$w0rd"
};

export const invalidEmailCredentials = {
    email: "invalid-email",
    password: "Password123"
};

export const shortPasswordCredentials = {
    email: "user@example.com",
    password: "short"
};

export const wrongCredentials = {
    email: "wrong@example.com",
    password: "WrongPassword123"
};

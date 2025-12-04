/**
 * Ownership request status enum
 */
export const OwnershipStatus = {
    Pending: "Pending",
    Analysing: "Analysing",
    Approved: "Approved",
    Rejected: "Rejected"
} as const;

export type OwnershipStatus = typeof OwnershipStatus[keyof typeof OwnershipStatus];

/**
 * Ownership request response from API
 */
export interface OwnershipRequest {
    id: string;
    animalId: string;
    animalName: string;
    userId: string;
    userName: string;
    amount: number;
    status: OwnershipStatus;
    requestInfo: string | null;
    requestedAt: string;
    approvedAt: string | null;
    updatedAt: string | null;
}

/**
 * Request body for creating a new ownership request
 */
export interface CreateOwnershipRequest {
    animalId: string;
}

/**
 * Request body for updating ownership request status to Analysing
 */
export interface UpdateOwnershipStatusRequest {
    requestInfo?: string;
}

/**
 * Request body for rejecting an ownership request
 */
export interface RejectOwnershipRequest {
    rejectionReason?: string;
}
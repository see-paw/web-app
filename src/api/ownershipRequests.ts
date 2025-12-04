import type { OwnershipRequest, UpdateOwnershipStatusRequest, RejectOwnershipRequest } from "@/types/ownershipRequest";
import type { PagedList } from "@/types/pagedList";
import { api } from "./api";

/**
 * API client for ownership request endpoints.
 * 
 * Provides functions to manage ownership requests (create, approve, reject, etc.)
 * 
 * @namespace ownershipRequestsApi
 */
export const ownershipRequestsApi = {
    /**
     * Fetch paginated ownership requests for the authenticated shelter admin.
     * Only returns requests for animals belonging to the admin's shelter.
     * 
     * @function getOwnershipRequests
     * @memberof ownershipRequestsApi
     * 
     * @param {Object} params - Request parameters
     * @param {number} [params.pageNumber=1] - Page number to fetch
     * @param {AbortSignal} [params.signal] - Abort signal for cancelling the request
     * 
     * @returns {Promise<PagedList<OwnershipRequest>>} Paginated list of ownership requests
     * 
     * @throws {Error} When the request fails or user is not authorized
     * 
     * @example
     * const requests = await ownershipRequestsApi.getOwnershipRequests({ 
     *   pageNumber: 1, 
     *   signal 
     * });
     */
    getOwnershipRequests: async ({ pageNumber = 1, signal }: {
        pageNumber?: number;
        signal?: AbortSignal;
    }): Promise<PagedList<OwnershipRequest>> => {
        const { data } = await api.get<PagedList<OwnershipRequest>>("/ownershiprequests", {
            params: { pageNumber },
            signal
        });

        return data;
    },

    /**
     * Update an ownership request status to "Analysing".
     * 
     * @function updateToAnalysing
     * @memberof ownershipRequestsApi
     * 
     * @param {Object} params - Request parameters
     * @param {string} params.id - Ownership request ID
     * @param {string} [params.requestInfo] - Optional notes/info about the analysis
     * 
     * @returns {Promise<OwnershipRequest>} Updated ownership request
     * 
     * @throws {Error} When the request fails or user is not authorized
     * 
     * @example
     * const updated = await ownershipRequestsApi.updateToAnalysing({ 
     *   id: "abc123", 
     *   requestInfo: "Under review by shelter team" 
     * });
     */
    updateToAnalysing: async ({ id, requestInfo }: {
        id: string;
        requestInfo?: string;
    }): Promise<OwnershipRequest> => {
        const body: UpdateOwnershipStatusRequest = { requestInfo };
        
        const { data } = await api.put<OwnershipRequest>(
            `/ownershiprequests/analysing/${id}`,
            body
        );

        return data;
    },

    /**
     * Approve an ownership request.
     * Updates animal state and cancels active fosterings.
     * 
     * @function approve
     * @memberof ownershipRequestsApi
     * 
     * @param {Object} params - Request parameters
     * @param {string} params.id - Ownership request ID
     * 
     * @returns {Promise<OwnershipRequest>} Approved ownership request
     * 
     * @throws {Error} When the request fails or user is not authorized
     * 
     * @example
     * const approved = await ownershipRequestsApi.approve({ id: "abc123" });
     */
    approve: async ({ id }: { id: string }): Promise<OwnershipRequest> => {
        const { data } = await api.put<OwnershipRequest>(
            `/ownershiprequests/approve/${id}`
        );

        return data;
    },

    /**
     * Reject an ownership request with optional reason.
     * 
     * @function reject
     * @memberof ownershipRequestsApi
     * 
     * @param {Object} params - Request parameters
     * @param {string} params.id - Ownership request ID
     * @param {string} [params.rejectionReason] - Reason for rejection
     * 
     * @returns {Promise<OwnershipRequest>} Rejected ownership request
     * 
     * @throws {Error} When the request fails or user is not authorized
     * 
     * @example
     * const rejected = await ownershipRequestsApi.reject({ 
     *   id: "abc123", 
     *   rejectionReason: "Incomplete documentation" 
     * });
     */
    reject: async ({ id, rejectionReason }: {
        id: string;
        rejectionReason?: string;
    }): Promise<OwnershipRequest> => {
        const body: RejectOwnershipRequest = { rejectionReason };
        
        const { data } = await api.put<OwnershipRequest>(
            `/ownershiprequests/reject/${id}`,
            body
        );

        return data;
    }
};
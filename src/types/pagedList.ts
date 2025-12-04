/**
 * Generic paginated list response from the API
 * 
 * @template T - Type of items in the list
 * @interface PagedList
 * @property {T[]} items - Array of items for the current page
 * @property {number} currentPage - Current page number (1-indexed)
 * @property {number} pageSize - Number of items per page
 * @property {number} totalPages - Total number of pages available
 * @property {number} totalCount - Total number of items across all pages
 */
export interface PagedList<T> {
    items: T[],
    currentPage: number,
    pageSize: number,
    totalPages: number,
    totalCount: number,
}

export interface PagedList<T> {
    items: T[],
    currentPage: number,
    pageSize: number,
    totalPages: number,
    totalCount: number,
}
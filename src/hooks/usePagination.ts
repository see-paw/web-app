import {useSearchParams} from "react-router-dom";

/**
 * Props for the usePagination hook
 * 
 * @interface UsePaginationProps
 * @property {number} currentPage - Current active page number
 * @property {number} totalPages - Total number of pages available
 */
interface UsePaginationProps {
    currentPage: number,
    totalPages: number
}

/**
 * Hook for managing pagination state and navigation
 * 
 * @param {UsePaginationProps} props - Hook configuration
 * @param {number} props.currentPage - Current active page number
 * @param {number} props.totalPages - Total number of pages available
 * @returns {Object} Pagination utilities
 */
export default function usePagination({ currentPage, totalPages }: UsePaginationProps) {
    const [searchParams, setSearchParams] = useSearchParams();

    /**
     * Updates the URL search params with new page number
     * 
     * @param {number} page - Page number to navigate to
     * @returns {void}
     */
    function handlePageChange(page: number) {
        if (page < 1 || page > totalPages) return;

        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("page", String(page));
        setSearchParams(newSearchParams);
    }

    /**
     * Calculates which page numbers to display in pagination
     * Shows up to 5 pages with current page centered when possible
     * 
     * @returns {number[]} Array of page numbers to display
     */
    const getPageNumbers = (): (number)[] => {
        const pages: (number)[] = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, 5);
            } else if (currentPage >= totalPages - 2) {
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(
                    currentPage - 2,
                    currentPage - 1,
                    currentPage,
                    currentPage + 1,
                    currentPage + 2
                );
            }
        }

        return pages;
    };

    /**
     * Navigates to the next page
     * 
     * @returns {void}
     */
    const goNext = () => handlePageChange(currentPage + 1);

    /**
     * Navigates to the previous page
     * 
     * @returns {void}
     */
    const goPrevious = () => handlePageChange(currentPage - 1);

    /**
     * Navigates to a specific page
     * 
     * @param {number} page - Target page number
     * @returns {void}
     */
    const goToPage = (page: number)  => handlePageChange(page);

    return {getPageNumbers, goNext, goPrevious, goToPage};
}

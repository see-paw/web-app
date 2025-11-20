import type { JSX } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faPaw } from "@fortawesome/free-solid-svg-icons";
import styles from "./Pagination.module.css";
import usePagination from "@/hooks/usePagination";

/**
 * Props for the Pagination component.
 * 
 * @interface PaginationProps
 * @property {number} currentPage - The current active page number (1-indexed)
 * @property {number} totalPages - The total number of pages available
 */
interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

/**
 * Pagination component that provides navigation controls for paginated content.
 * 
 * @component
 * @param {PaginationProps} props - The component props
 * @param {number} props.currentPage - The current active page number (1-indexed)
 * @param {number} props.totalPages - The total number of pages available
 * @returns {JSX.Element} A navigation element with pagination controls
 * 
 * @description
 * This component displays:
 * - Previous button (chevron left) - disabled on first page
 * - Page number buttons represented by paw icons
 * - Next button (chevron right) - disabled on last page
 * 
 * Features:
 * - Accessibility support with ARIA labels and attributes
 * - Active page highlighting
 * - Disabled state management for navigation buttons
 * - Responsive design with CSS modules
 * - Integration with usePagination hook for page logic
 * 
 * @example
 * <Pagination currentPage={1} totalPages={5} />
 * 
 * @example
 * // With query parameters from React Router
 * const [searchParams] = useSearchParams();
 * const page = searchParams.get("page") ?? "1";
 * <Pagination currentPage={Number(page)} totalPages={10} />
 */
function Pagination({ currentPage, totalPages }: PaginationProps): JSX.Element {
    const {getPageNumbers, goNext, goPrevious, goToPage} = usePagination({ currentPage, totalPages });

    const pageNumbers = getPageNumbers();

    return (
        <nav
            className={styles.paginationNav}
            aria-label="Paginação"
            data-testid="pagination"
        >
            <ul className={styles.paginationList} data-testid="pagination-list">
                <li>
                    <button
                        type="button"
                        onClick={goPrevious}
                        disabled={currentPage === 1}
                        className={`${styles.paginationButton} ${styles.navButton}`}
                        aria-label="Página anterior"
                        data-testid="pagination-previous"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                </li>

                {pageNumbers.map((pageNum, index) => (
                    <li key={index}>
                        <button
                            type="button"
                            onClick={() => goToPage(pageNum!)}
                            disabled={pageNum === currentPage}
                            className={`${styles.paginationButton} ${
                                pageNum === currentPage ? styles.active : ""
                            }`}
                            aria-label={`Página ${pageNum}`}
                            aria-current={pageNum === currentPage ? "page" : undefined}
                            data-testid={`pagination-page-${pageNum}`}
                            data-active={pageNum === currentPage}
                        >
                            <FontAwesomeIcon icon={faPaw} />
                        </button>
                    </li>
                ))}

                <li>
                    <button
                        type="button"
                        onClick={goNext}
                        disabled={currentPage === totalPages}
                        className={`${styles.paginationButton} ${styles.navButton}`}
                        aria-label="Próxima página"
                        data-testid="pagination-next"
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default Pagination;

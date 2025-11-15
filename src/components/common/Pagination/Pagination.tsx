import type { JSX } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faPaw } from "@fortawesome/free-solid-svg-icons";
import styles from "./Pagination.module.css";
import usePagination from "@/hooks/usePagination";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

function Pagination({ currentPage, totalPages }: PaginationProps): JSX.Element {
    const {getPageNumbers, goNext, goPrevious, goToPage} = usePagination({ currentPage, totalPages });

    const pageNumbers = getPageNumbers();

    return (
        <nav className={styles.paginationNav} aria-label="Paginação">
            <ul className={styles.paginationList}>
                <li>
                    <button
                        type="button"
                        onClick={goPrevious}
                        disabled={currentPage === 1}
                        className={`${styles.paginationButton} ${styles.navButton}`}
                        aria-label="Página anterior"
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
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default Pagination;

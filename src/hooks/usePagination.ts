import {useSearchParams} from "react-router-dom";

interface UsePaginationProps {
    currentPage: number,
    totalPages: number
}

export default function usePagination({ currentPage, totalPages }: UsePaginationProps) {
    const [searchParams, setSearchParams] = useSearchParams();

    function handlePageChange(page: number) {
        if (page < 1 || page > totalPages) return;

        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("page", String(page));
        setSearchParams(newSearchParams);
    }

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

    const goNext = () => handlePageChange(currentPage + 1);
    const goPrevious = () => handlePageChange(currentPage - 1);
    const goToPage = (page: number)  => handlePageChange(page);

    return {getPageNumbers, goNext, goPrevious, goToPage};
}
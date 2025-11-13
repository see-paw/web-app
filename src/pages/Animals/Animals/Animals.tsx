import type { Animal } from "@/types/animal";
import AnimalList from "@/components/features/AnimalList/AnimalList";
import { useQuery } from "@tanstack/react-query";
import { animalsApi } from "@/api/animals";
import type { PagedList } from "@/types/pagedList";
import Pagination from "@/components/common/Pagination/Pagination";
import { useSearchParams } from "react-router-dom";
import styles from "./Animals.module.css";

function Animals() {
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page") ?? "1";

    const { data: pagedAnimals } = useQuery<PagedList<Animal>>({
        queryKey: ["animals", page],
        queryFn: ({ signal }) => animalsApi.getAnimals({
            pageNumber: page,
            signal: signal
        }),
        staleTime: 5000
    });

    if (!pagedAnimals) {
        return (<div>Loading...</div>);
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <AnimalList animals={pagedAnimals?.items} />
            </div>
            <Pagination 
                currentPage={pagedAnimals.currentPage}
                totalPages={pagedAnimals.totalPages}
            />
        </div>
    );
}

export default Animals;

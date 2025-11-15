import {useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {animalsApi} from "@/api/animals";

import styles from "./AnimalDetails.module.css";
import AnimalHeader from "@/components/common/AnimalHeader/AnimalHeader";
import AnimalImages from "@/components/features/AnimalImages/AnimalImages";
import AnimalInfo from "@/components/features/AnimalInfo/AnimalInfo";
function AnimalDetails() {
    const {animalId} = useParams();


    const { data: animal, isError, error } = useQuery({
        queryKey:["animal", animalId],
        queryFn:({signal}) => animalsApi.getAnimalDetails({
            id:animalId!, //este valor não é undefined quando a queryFn é chamada
            signal: signal,
        }),
        enabled: !!animalId, //garante que o queryFn só é chamado quando existe animalId
        staleTime:5000
    });

    if (!animal) return null;

    if (isError) {
        return <p>{error.message}</p>;
    }

    return (
        <div className={styles.page}>
            <AnimalHeader name={animal.name} sex={animal.sex} />

            <div className={styles.layout} >
                {<AnimalImages images={animal.images} />}
                <AnimalInfo animal={animal} />
            </div>
        </div>
    );


}

export default AnimalDetails;
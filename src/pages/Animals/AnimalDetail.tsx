import {useParams} from "react-router-dom";

function AnimalDetail() {
    const params = useParams();

    return (
        <h1>{params.animalId}</h1>
    );
}

export default AnimalDetail;
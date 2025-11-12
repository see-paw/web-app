import {useLoaderData} from "react-router-dom";
import type {Animal} from "@/types/animal";
import AnimalList from "@/components/features/AnimalList";

function Animals() {
    const animals = useLoaderData<Animal[]>();

    return (
            <AnimalList animals={animals} />
    );
}

export default Animals;
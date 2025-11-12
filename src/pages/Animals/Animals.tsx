import {useLoaderData} from "react-router-dom";
import type {Animal} from "../../types/animal.ts";

function Animals() {
    const animals = useLoaderData<Animal[]>();

    return (
        <div>
            <h1>Animals</h1>
            <ul>
                {animals.length > 0 && animals.map(animal =>
                <li key={animal.id}>
                    {animal.name}
                </li>)}
            </ul>
        </div>
    );
}

export default Animals;
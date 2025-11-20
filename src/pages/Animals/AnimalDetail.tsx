import {useParams} from "react-router-dom";

/**
 * AnimalDetail page component that displays detailed information about a specific animal.
 * 
 * @component
 * @returns {JSX.Element} The rendered animal detail page
 * 
 * @example
 * // Route definition
 * <Route path="/animals/:animalId" element={<AnimalDetail />} />
 */
function AnimalDetail() {
    const params = useParams();

    return (
        <h1>{params.animalId}</h1>
    );
}

export default AnimalDetail;

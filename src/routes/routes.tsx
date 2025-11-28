import {createBrowserRouter} from "react-router-dom";
import Error from "../pages/Error/Error.tsx";
import Home from "../pages/Home/Home.tsx";
import Animals from "../pages/Animals/Animals/Animals.tsx";
import AnimalDetails from "../pages/Animals/AnimalDetails/AnimalDetails.tsx";
import {animalsLoader as animalsLoader} from "./loaders/animal.ts";
import MainLayout from "../components/layout/MainLayout.tsx";
import {animalDetailsLoader} from "@/routes/loaders/animalDetails";
import Login from "@/pages/Auth/Login/Login";
import {loginLoader} from "@/routes/loaders/login";
import CreateAnimal from "@/pages/Animals/CreateAnimal/CreateAnimal";
import {createAnimalLoader} from "@/routes/loaders/createAnimal";
import SelectFosterValue from "@/pages/Fosterings/NewFostering/SelectValue/SelectFosterValue";
import FosterForm from "@/pages/Fosterings/NewFostering/FosteringForm/FosterForm";
import FosterConfirmation from "@/pages/Fosterings/NewFostering/Confirmation/FosterConfirmation";
import { newFosteringLoader } from "@/routes/loaders/newFosteringLoader";


/**
 * Application router configuration using React Router v7
 * Defines all routes, nested layouts, loaders, and error boundaries
 */
const router = createBrowserRouter([
    { path: '/',
        element: <MainLayout/>,
        errorElement: <Error/>,
        children: [
            {index: true, element: <Home/>},
            {path: "animals", element: <Animals/>, loader: animalsLoader},
            {path: "animals/new", element: <CreateAnimal/>, loader: createAnimalLoader},
            {path: "animals/:animalId", element: <AnimalDetails/>, loader: animalDetailsLoader},
            {path: "login", element: <Login/>, loader: loginLoader},
            {path: "animals/:animalId/foster",element: <SelectFosterValue/>,loader: newFosteringLoader},
            {path: "animals/:animalId/foster/form",element: <FosterForm/>,loader: newFosteringLoader},
            {path: "animals/:animalId/foster/confirmation",element: <FosterConfirmation/>},
        ]}
])

export default router;

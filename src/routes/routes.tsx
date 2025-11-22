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

const router = createBrowserRouter([
    { path: '/',
        element: <MainLayout/>,
        errorElement: <Error/>,
        children: [
            {index: true, element: <Home/>},
            {path: "animals", element: <Animals/>, loader: animalsLoader},
            {path: "animals/:animalId", element: <AnimalDetails/>, loader: animalDetailsLoader},
            {path: "login", element: <Login/>, loader: loginLoader},
        ]},
])

export default router;
import MainNavigation from "./MainNavigation.tsx";
import {Outlet} from "react-router-dom";


function MainLayout() {
    return (
        <>
            <MainNavigation />
            <main>
                <Outlet/>
            </main>
        </>
    );
}

export default MainLayout;
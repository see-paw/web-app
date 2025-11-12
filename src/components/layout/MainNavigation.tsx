import NavBar from "./NavBar.tsx";
import {links} from "../../shared/links";

function MainNavigation() {
    return (
        <NavBar links={links}></NavBar>
    );
}

export default MainNavigation;
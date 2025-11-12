import {Navbar} from "@/components";
import seepaw from "/src/assets/seepaw.png"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket, faBell, faHeart, faPaw, faUser} from "@fortawesome/free-solid-svg-icons";
import {v4 as uuidv4} from 'uuid';


const navItems = [
    {
        id: uuidv4(),
        icon: <FontAwesomeIcon icon={faHeart}/>,
        to: '/favorites',
    },
    {
        id: uuidv4(),
        icon: <FontAwesomeIcon icon={faBell}/>,
        to: '/notifications',
    },
    {
        id: uuidv4(),
        icon: <FontAwesomeIcon icon={faPaw}/>,
        to: '/animals',
    },
    {
        id: uuidv4(),
        icon: <FontAwesomeIcon icon={faUser}/>,
        to: '/user/profile',
    },
    {
        id: uuidv4(),
        icon: <FontAwesomeIcon icon={faArrowRightFromBracket}/>,
        to: '/logout',
    },
]


function MainNavigation() {
    return (
        <Navbar logo={
            {img: seepaw, alt: "SeePaw logo"}}
                items={navItems}></Navbar>
    );
}

export default MainNavigation;

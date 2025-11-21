import {Navbar} from "@/components";
import seepaw from "/src/assets/seepaw.png"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket, faBell, faHeart, faPaw, faUser} from "@fortawesome/free-solid-svg-icons";
import {v4 as uuidv4} from 'uuid';

/**
 * Navigation items configuration for the main navigation bar.
 * Each item contains:
 * - Unique ID generated with UUID v4
 * - FontAwesome icon component
 * - Route path for navigation
 * 
 * @constant {Array<{id: string, icon: JSX.Element, to: string}>}
 */
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

/**
 * MainNavigation component that renders the main navigation bar with SeePaw branding.
 * 
 * @component
 * @returns {JSX.Element} The configured Navbar component with logo and navigation items
 * 
 * @description
 * This component provides the main navigation structure for the application with:
 * - SeePaw logo (clickable link to home)
 * - Navigation items for key features:
 *   - Favorites (heart icon) - /favorites
 *   - Notifications (bell icon) - /notifications
 *   - Animals (paw icon) - /animals
 *   - User Profile (user icon) - /user/profile
 *   - Logout (arrow icon) - /logout
 * 
 * Features:
 * - FontAwesome icons for visual consistency
 * - React Router integration for navigation
 * - Unique IDs for each nav item to prevent React key warnings
 * - Responsive design inherited from Navbar component
 * 
 * @example
 * // Used in MainLayout
 * function MainLayout() {
 *   return (
 *     <>
 *       <MainNavigation />
 *       <main><Outlet /></main>
 *     </>
 *   );
 * }
 */
function MainNavigation() {
    return (
        <Navbar logo={
            {img: seepaw, alt: "SeePaw logo"}}
                items={navItems}></Navbar>
    );
}

export default MainNavigation;

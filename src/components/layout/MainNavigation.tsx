import {Navbar} from "@/components";
import seepaw from "/src/assets/seepaw.png"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket, faCirclePlus, faClipboardList, faHeart, faPaw, faUser} from "@fortawesome/free-solid-svg-icons";
import {v4 as uuidv4} from 'uuid';
import {useAuthStore} from "@/stores/auth.store";
import {UserRole} from "@/types/user";
import {useIsAuth} from "@/hooks/useIsAuth";
import type {NavItem} from "@/components/layout/Navbar/Navbar";
import NotificationsDropdown from "../features/NotificationsDropDown/NotificationsDropdown";

/**
 * MainNavigation component that renders the main navigation bar with SeePaw branding.
 * 
 * @component
 * @returns {JSX.Element} The configured Navbar component with logo and navigation items
 */
function MainNavigation() {
    const isAuth = useIsAuth();
    const user = useAuthStore((authStore) => authStore.user);
    const role = user?.role;

    const navItems : NavItem[] = [
        isAuth && role === UserRole.User && {
            id: uuidv4(),
            icon: <FontAwesomeIcon icon={faHeart}/>,
            to: '/favorites',
        },
        isAuth && role === UserRole.AdminCAA && {
            id: uuidv4(),
            icon: <FontAwesomeIcon icon={faClipboardList}/>,
            to: '/admin/ownership-requests',
        },
        {
            id: uuidv4(),
            icon: <FontAwesomeIcon icon={faPaw}/>,
            to: '/animals',
            end: true,
        },
        isAuth && role === UserRole.AdminCAA && {
            id: uuidv4(),
            icon:  <FontAwesomeIcon icon={faCirclePlus}/>,
            to: '/animals/new',
            isLargeIcon: true,
        },
        isAuth && {
            id: uuidv4(),
            icon: <FontAwesomeIcon icon={faUser}/>,
            to: '/user/profile',
        },
        !isAuth && {
            id: uuidv4(),
            icon: <FontAwesomeIcon icon={faUser}/>,
            to: '/login',
        },
        isAuth && {
            id: uuidv4(),
            icon: <FontAwesomeIcon icon={faArrowRightFromBracket}/>,
            to: '/',
            isLogout: true,
        },
    ].filter(Boolean) as NavItem[];

    return (
        <Navbar 
            logo={{img: seepaw, alt: "SeePaw logo"}}
            notificationsDropdown={isAuth ? <NotificationsDropdown /> : undefined}
            items={navItems}
        />
    );
}

export default MainNavigation;

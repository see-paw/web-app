import type {ReactNode} from 'react';
import {Link, NavLink, useNavigate} from 'react-router-dom';
import styles from './Navbar.module.css';
import {queryClient} from "@/lib/queryClient";
import {useAuthStore} from "@/stores/auth.store";

export interface NavItem {
    id: string;
    icon: ReactNode;
    to: string;
    text?: string;
    isLogout?: boolean;
    isLargeIcon?: boolean;
    end?: boolean;
}

/**
 * Props for the Navbar component.
 *
 * @interface NavbarProps
 * @property {Object} [logo] - Optional logo configuration
 * @property {string} logo.img - Path to the logo image
 * @property {string} logo.alt - Alternative text for the logo image
 * @property {Array<Object>} [items] - Optional array of navigation items
 * @property {string} items[].id - Unique identifier for the navigation item
 * @property {ReactNode} items[].icon - Icon element to display (typically FontAwesome icon)
 * @property {string} items[].to - Route path for navigation
 * @property {string} [items[].text] - Optional text label to display alongside the icon
 */
export interface NavbarProps {
    logo?: { img: string; alt: string };
    notificationsDropdown?: ReactNode;
    items?: NavItem[];
}

/**
 * Navbar component that renders a navigation bar with logo and navigation items.
 *
 * @component
 * @param {NavbarProps} props - The component props
 * @param {Object} [props.logo] - Optional logo configuration with image path and alt text
 * @param {Array} [props.items] - Optional array of navigation items with icons and routes
 * @returns {JSX.Element} A navigation bar element
 */
export const Navbar = ({logo, notificationsDropdown, items}: NavbarProps) => {
    const navigate = useNavigate();
    const logout = useAuthStore(s => s.logout);

    /**
     * Handles the logout process for the current user.*
     * @function
     * @returns {void}
     */
    function handleLogout() {
        logout();
        queryClient.clear();
        navigate("/");
    }

    return (
        <nav className={styles.navbar}>
            {logo && (
                <div className={styles.logoContainer}>
                    <Link to="/">
                        <img className={styles.logo} src={logo.img} alt={logo.alt}/>
                    </Link>
                </div>
            )}

            {(notificationsDropdown || (items && items.length > 0)) && (
                <ul className={styles.navItems}>
                    {notificationsDropdown && (
                        <li className={styles.navItem}>
                            {notificationsDropdown}
                        </li>
                    )}
                    {items && items.map((item) => (
                        <li key={item.id} className={styles.navItem}>
                            {item.isLogout ? (
                                <button
                                    type="button"
                                    className={styles.navLink}
                                    onClick={handleLogout}
                                >
                                    <span className={item.isLargeIcon ? styles.navIconLarge : styles.navIcon}>{item.icon}</span>
                                    {item.text && <span className={styles.navText}>{item.text}</span>}
                                </button>
                            ) : (
                                <NavLink
                                    to={item.to}
                                    end={item.end}
                                    className={({isActive}) =>
                                        isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                                    }
                                >
                                    <span className={item.isLargeIcon ? styles.navIconLarge : styles.navIcon}>{item.icon}</span>
                                    {item.text && <span className={styles.navText}>{item.text}</span>}
                                </NavLink>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </nav>
    );
};

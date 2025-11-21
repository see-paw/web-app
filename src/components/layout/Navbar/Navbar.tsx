import type {ReactNode} from 'react';
import {Link, NavLink} from 'react-router-dom';
import styles from './Navbar.module.css';

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
    items?: {
        id: string;
        icon: ReactNode;
        to: string;
        text?: string;
    }[];
}

/**
 * Navbar component that renders a navigation bar with logo and navigation items.
 * 
 * @component
 * @param {NavbarProps} props - The component props
 * @param {Object} [props.logo] - Optional logo configuration with image path and alt text
 * @param {Array} [props.items] - Optional array of navigation items with icons and routes
 * @returns {JSX.Element} A navigation bar element
 * 
 * @description
 * This component provides a flexible navigation bar that can include:
 * - An optional logo (clickable link to home page)
 * - Optional navigation items with:
 *   - Icons (required)
 *   - Route paths (required)
 *   - Optional text labels
 *   - Active state highlighting via NavLink
 * 
 * Features:
 * - Active route highlighting with CSS classes
 * - React Router integration with NavLink for active states
 * - Responsive design with CSS modules
 * - Flexible configuration - logo and items are optional
 * - Semantic HTML with nav element
 * 
 * @example
 * // Basic usage with logo and items
 * <Navbar 
 *   logo={{ img: "/logo.png", alt: "Company Logo" }}
 *   items={[
 *     { id: "1", icon: <HomeIcon />, to: "/", text: "Home" },
 *     { id: "2", icon: <ProfileIcon />, to: "/profile" }
 *   ]}
 * />
 * 
 * @example
 * // Logo only
 * <Navbar logo={{ img: "/logo.png", alt: "Logo" }} />
 * 
 * @example
 * // Items only (no logo)
 * <Navbar items={[
 *   { id: "1", icon: <Icon />, to: "/page" }
 * ]} />
 */
export const Navbar = ({ logo, items }: NavbarProps) => {
    return (
        <nav className={styles.navbar}>
            {logo && (
                <div className={styles.logoContainer}>
                    <Link to="/">
                        <img className={styles.logo} src={logo.img} alt={logo.alt} />
                    </Link>
                </div>
            )}

            {items && items.length > 0 && (
                <ul className={styles.navItems}>
                    {items.map((item) => (
                        <li key={item.id} className={styles.navItem}>
                            <NavLink 
                                to={item.to} 
                                className={({isActive}) => 
                                    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                                }
                            >
                                <span className={styles.navIcon}>{item.icon}</span>
                                {item.text && <span className={styles.navText}>{item.text}</span>}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            )}
        </nav>
    );
};

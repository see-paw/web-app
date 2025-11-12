import type {ReactNode} from 'react';
import {Link, NavLink} from 'react-router-dom';
import styles from './Navbar.module.css';


export interface NavbarProps {
    logo?: { img: string; alt: string };
    items?: {
        id: string;
        icon: ReactNode;
        to: string;
        text?: string;
    }[];
}

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
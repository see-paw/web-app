import MainNavigation from "./MainNavigation.tsx";
import {Outlet} from "react-router-dom";
import styles from './MainLayout.module.css';


/**
 * MainLayout component that provides the main application layout structure.
 *
 * @component
 * @returns {JSX.Element} The main layout with navigation and outlet for child routes
 */
function MainLayout() {
    return (
        <div className={styles.layout}>
            {/* Background fixo que fica atrás de tudo */}
            <div className={styles.backgroundWrapper} />

            {/* Conteúdo que flutua sobre o fundo */}
            <div className={styles.contentWrapper}>
                <MainNavigation />
                <main className={styles.mainContent}>
                    <Outlet/>
                </main>
            </div>
        </div>
    );
}

export default MainLayout;
